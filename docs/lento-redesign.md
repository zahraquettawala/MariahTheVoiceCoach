# Lento (formerly Mariah): redesign notes

Discussed Oct 20, 2026 on a walk. Built in the "Lento redesign" change; what got built is at the end.

## Name and brand

- The app and coach are now called Lento, the musical tempo marking for "slow." It covers both music and the slow-down philosophy.
- Lento is a sloth, but the name doesn't include "the sloth," like Duolingo's owl is named Duo. The sloth is her visual form.
- Ruled out: "Savor" (reads like a credit card), "Encore" (the meaning fits, but it clashes with a sloth mascot), and "Kathy" (sentimental, but a real person's name on a product).
- The thesis: the mascot reminds you to slow down and make time for the art and passions you love.

## What stays as-is

- Pitch detection works.
- The auto half-step progression after a set time works well. Keep it.

## What wasn't working

- The app shell felt off mid-session.
- You had to flip through the warm-ups manually.

## Per-exercise flow (modeled on Aussie Vocal Coach-style warm-up videos)

1. Lento demos the pattern first, singing something like "me-me-ma-ma-moo."
2. She steps back, and you sing the pattern with only the piano while the app listens for pitch.
3. It auto-advances a half step up or down the scale without you tapping anything.

## Lesson structure (not just a warm-up)

- A "Start your vocal lesson" moment, then about 15-20 minutes total.
- Warm up the voice first, then scales, then a few sections of a song you're practicing, then a short cooldown.
- The warm-up structure varies from session to session instead of running the same fixed sequence, like a real coach mixing things up.
- Warm-ups adapt to how you're feeling.

## Live coaching

- Lento can interrupt in real time during warm-ups, scales, and songs, like a real coach would.
- She flags when you're sharp, flat, or breathy because your breath isn't supporting the note.
- She then plays piano with you and drills that note or phrase until it's right, then lets you continue.
- The reference is a real vocal coach: practicing the same thing over and over until you can sing the piece confidently.

## Sound

- A warm, realistic grand piano sample, like the one at a real coach's house. It shouldn't sound like a synth or a toy.

## Vision

- Singing instruction without driving to a coach, paying a lot, or finding time. It makes it easier to prioritize your art when you work full time.
- You open the app, meet Lento, get a vocal warm-up in, and feel good about your progress. The long-term goal is to keep getting better at singing.

## Open items

- The app doesn't use an ElevenLabs agent yet. That's the next layer: the agent would be the live voice coach you can talk back to.
- Lento's singing demo uses a small built-in vocal synth. A recorded or ElevenLabs singing voice would sound more human.
- Breathiness is a rough guess: sound with no clear pitch. It needs tuning on real singing.

## What got built

- **Rename:** Lento everywhere in the app. Saved progress carries over from the old name; the welcome screen shows once more so you meet Lento.
- **Lesson** (`lesson.html`, `lesson.js`): check-in with three moods (a bit tired, pretty good, ready to sing), a plan of warm-ups, scales, your song and a cooldown that changes every lesson and avoids repeating the last one, then one full-screen stage with a section tracker, Lento's speech bubble, the pitch lane, keyboard, and Pause / Skip. An "Up next" card counts down between exercises, so the whole lesson runs hands-free.
- **Exercise library** (`exercises.js`): 12 exercises across warm-ups, scales and cooldowns, each with the syllables Lento sings.
- **Demo, sing, advance:** Lento sings the first key, then you sing with the piano and it climbs a half step per loop on its own.
- **Live coaching:** after a phrase that's mostly flat, sharp or breathy, Lento stops, says where it went wrong (for example "on the top note"), and sings it with you again, up to two more tries, at most three times per exercise.
- **Your song** (`song.html`, `song.js`): up to three sections with a starting note and an optional melody.
- **Piano** (`piano.js`): Salamander Grand samples from A1 to C7, a short room reverb, a softer top end, and a natural damper release.
- **Singing voice** (`sing.js`): a formant vocal synth that sings syllables on pitch with vibrato, including a lip-trill flutter.
