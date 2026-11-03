import { useEffect, useState, type FormEvent } from "react";
import type { CoachContext } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { askCoach, buildCoachContext } from "../services/coach";
import { useAppSelector } from "../state/hooks";

const suggestions = ["How am I progressing?", "Explain my current program", "What should I improve before my next level review?"];

export function CoachPage() {
  const profile = useAppSelector((state) => state.app.profile)!;
  const workout = useAppSelector((state) => state.app.preparedWorkout) ?? undefined;
  const [context, setContext] = useState<CoachContext | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ question: string; answer: string; source: string }[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { void buildCoachContext(profile, workout).then(setContext); }, [profile, workout]);
  const submit = async (event?: FormEvent, suggested?: string) => { event?.preventDefault(); const prompt = suggested ?? question.trim(); if (!prompt || !context || loading) return; setLoading(true); setQuestion(""); const response = await askCoach(prompt, context); setMessages((current) => [...current, { question: prompt, answer: response.answer, source: response.source }]); setLoading(false); };
  return <AppShell><header className="page-heading"><p className="kicker">BellGrinda Coach</p><h1>Understand your training.</h1><p>The Coach explains your real BellGrinda data. It cannot prescribe outside the engine, lift safety restrictions, diagnose pain, or promote your level.</p></header>
    {!navigator.onLine ? <div className="guidance"><p>BellGrinda Coach is unavailable offline. Your readiness check, workout, and level review remain fully available.</p></div> : null}
    <div className="coach-suggestions">{suggestions.map((item) => <button type="button" key={item} onClick={() => void submit(undefined, item)}>{item}</button>)}</div>
    <section className="coach-thread">{messages.length ? messages.map((message, index) => <article key={`${message.question}-${index}`}><p className="coach-question">{message.question}</p><div className="coach-answer"><small>{message.source === "ai" ? "BellGrinda Coach" : "BellGrinda explanation"}</small><p>{message.answer}</p></div></article>) : <p className="muted-copy">Ask about your program, workout choices, readiness, recent performance, assessments, or level progression.</p>}</section>
    <form className="coach-form" onSubmit={submit}><label className="field">Ask BellGrinda<textarea value={question} maxLength={500} onChange={(event) => setQuestion(event.target.value)} placeholder="Why did my workout get easier today?" /></label><button className="button primary" disabled={!context || loading || !question.trim()}>{loading ? "Thinking…" : "Ask Coach"}</button></form>
  </AppShell>;
}
