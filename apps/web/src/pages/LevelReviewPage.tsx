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
  const [review, setReview] = useState<LevelProgressionReview | null>(null);
  const [working, setWorking] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => { void levelReviewRepository.latest().then((item) => setReview(item ?? null)); }, []);
  const runReview = async () => {
    setWorking(true);
    const [sessions, painEvents] = await Promise.all([sessionRepository.listHistory(), painEventRepository.listAll()]);
    const next = evaluateLevelReadiness(profile, sessions, painEvents);
    await levelReviewRepository.save(next); setReview(next); setWorking(false);
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
  return <AppShell action={<Link className="icon-button" to="/profile" aria-label="Back to profile"><ArrowLeft size={22} /></Link>}>
    <header className="page-heading"><p className="kicker">Program progression</p><h1>Review my level.</h1><p>If your training consistently feels too easy, BellGrinda checks completion, effort, movement exposure, and safety before offering a controlled trial.</p></header>
    <section className="level-current"><small>Current level</small><h2>{label(profile.trainingLevel)}</h2><p>Phase {profile.phase}</p></section>
    {!currentReviewMatches ? <button className="button primary" disabled={working} onClick={runReview}>{working ? "Reviewing…" : "Review recent training"}</button> : review ? <>
      <section className="review-stats"><span><strong>{review.recentAverageRpe?.toFixed(1) ?? "—"}</strong> average RPE</span><span><strong>{review.completionRate}%</strong> completion</span><span><strong>{review.sessionsAnalyzed}</strong> sessions</span><span><strong>{label(review.confidence)}</strong> confidence</span></section>
      <section className={`level-result ${review.result}`}><p className="kicker">{label(review.result)}</p><h2>{review.result === "trial_approved" ? `You may be ready for ${label(review.proposedLevel)}` : review.result === "passed" ? "You’re ready to progress" : review.result === "failed" ? `Stay at ${label(review.currentLevel)} for now` : "More evidence is needed"}</h2><ul>{review.evidence.map((item) => <li key={item}>{item}</li>)}</ul>{review.blockers.length ? <div><strong>What needs to change</strong><ul>{review.blockers.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}</section>
      {review.result === "trial_approved" ? <button className="button primary" onClick={startTrial}>Try a {label(review.proposedLevel)} workout</button> : null}
      {review.result === "passed" ? <button className="button primary" onClick={promote}>Move to {label(review.proposedLevel)}</button> : null}
      {["not_ready", "failed"].includes(review.result) ? <button className="button secondary" disabled={working} onClick={runReview}>Review again with newer sessions</button> : null}
    </> : null}
  </AppShell>;
}
