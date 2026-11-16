import { useEffect, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { Link, useNavigate } from "react-router-dom";
import type { LevelProgressionReview } from "@bellgrinda/domain";
import { createLevelTrial, evaluateLevelReadiness } from "@bellgrinda/training-engine";
import { AppShell } from "../components/AppShell";
import { levelHistoryRepository, levelReviewRepository, painEventRepository, profileRepository, sessionRepository } from "../persistence/database";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setPreparedWorkout, setProfile } from "../state/store";

const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function LevelReviewPage() {
  const profile = useAppSelector((state) => state.app.profile)!;
  const activeSession = useAppSelector((state) => state.app.activeSession);
  const [review, setReview] = useState<LevelProgressionReview | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => { void levelReviewRepository.latest().then((item) => setReview(item ?? null)); }, []);
  const runReview = async () => {
    setWorking(true);
    setError("");
    try {
      const [sessions, painEvents] = await Promise.all([sessionRepository.listHistory(), painEventRepository.listAll()]);
      const next = evaluateLevelReadiness(profile, sessions, painEvents);
      await levelReviewRepository.save(next);
      setReview(next);
    } catch {
      setError("Your training history could not be reviewed. Please try again.");
    } finally {
      setWorking(false);
    }
  };
  const startTrial = () => {
    if (!review) return;
    dispatch(setPreparedWorkout(createLevelTrial(review, profile)));
    navigate("/workout");
  };
  const promote = async () => {
    if (!review || review.result !== "passed") return;
    const changedAt = new Date().toISOString();
    const next = { ...profile, trainingLevel: review.proposedLevel, phase: 1 };
    await Promise.all([profileRepository.save(next), levelHistoryRepository.save({ id: crypto.randomUUID(), previousLevel: profile.trainingLevel, newLevel: review.proposedLevel, changedAt, reviewId: review.id, recentAverageRpe: review.recentAverageRpe, reason: "Passed early progression review and controlled level trial.", progressionType: "early" })]);
    dispatch(setProfile(next)); navigate("/profile");
  };
  const currentReviewMatches = review?.currentLevel === profile.trainingLevel;
  return <AppShell action={<Link className="icon-button" to="/" aria-label="Back to training"><ArrowLeft size={22} /></Link>}>
    <header className="page-heading"><p className="kicker">Program progression</p><h1>Take a progress test.</h1><p>Think you have outgrown your current level? You can request a test whenever you feel ready. BellGrinda checks your recent consistency, effort, movement exposure, and safety before preparing a controlled workout from the next level.</p></header>
    <section className="level-current"><small>Current level</small><h2>{label(profile.trainingLevel)}</h2><p>Phase {profile.phase}</p></section>
    {activeSession ? <section className="progress-test-notice"><h2>Finish your current workout first.</h2><p>Your saved workout stays in place. Complete or end it before starting a progress test.</p><Link className="button secondary" to="/session">Resume workout</Link></section> : null}
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    {!currentReviewMatches ? <button className="button primary" disabled={working || Boolean(activeSession)} onClick={runReview}>{working ? "Checking your training…" : "Start progress test"}</button> : review ? <>
      <section className="review-stats"><span><strong>{review.recentAverageRpe?.toFixed(1) ?? "—"}</strong> average RPE</span><span><strong>{review.completionRate}%</strong> completion</span><span><strong>{review.sessionsAnalyzed}</strong> sessions</span><span><strong>{label(review.confidence)}</strong> confidence</span></section>
      <section className={`level-result ${review.result}`}><p className="kicker">{label(review.result)}</p><h2>{review.result === "trial_approved" ? `You may be ready for ${label(review.proposedLevel)}` : review.result === "passed" ? "You’re ready to progress" : review.result === "failed" ? `Stay at ${label(review.currentLevel)} for now` : "More evidence is needed"}</h2><ul>{review.evidence.map((item) => <li key={item}>{item}</li>)}</ul>{review.blockers.length ? <div><strong>What needs to change</strong><ul>{review.blockers.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}</section>
      {review.result === "trial_approved" ? <button className="button primary" disabled={Boolean(activeSession)} onClick={startTrial}>Begin {label(review.proposedLevel)} test workout</button> : null}
      {review.result === "passed" ? <button className="button primary" onClick={promote}>Move to {label(review.proposedLevel)}</button> : null}
      {["not_ready", "failed"].includes(review.result) ? <button className="button secondary" disabled={working || Boolean(activeSession)} onClick={runReview}>{working ? "Checking your training…" : "Check again with newer workouts"}</button> : null}
    </> : null}
  </AppShell>;
}
