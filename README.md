# MariahTheVoiceCoach
AI voice coach for singers: daily agility warmups, real-time pitch scoring, and an ElevenLabs voice agent as your teacher.

## Try it

Open **https://zahraquettawala.github.io/MariahTheVoiceCoach/** on your phone in Safari, tap **Start**, allow the microphone, and sing.

## What's in the app

- **Today** (`index.html`): today's warmup, your streak, minutes this week, last accuracy, and the exercise list.
- **Session** (`warmup.html`): four sing-along exercises modeled on the Aussie Vocal Coach "Daily Vocal Exercises for a POWERFUL Voice" video (fifths, more fifths, 5-note scale, fast runs). The piano gives the note and plays along, each loop moves up a half step then back down, and a live pitch lane shows the target notes and your voice. After each loop Mariah says whether you were on pitch, flat or sharp. Settings: lowest note, how far to climb, speed, spoken feedback.
- **Tuner** (`tuner.html`): shows the note you're singing against a target note, with a flat / on pitch / sharp meter, a piano reference note, and a 6-second trace.
- **Progress** (`progress.html`): accuracy over recent sessions, accuracy per exercise, and session history.

Wear wired earbuds so the mic hears you, not the piano. Within 25 cents of the target counts as on pitch, so vibrato isn't penalized.

## Code

`exercises.js` defines the workout, `store.js` saves sessions on the phone (localStorage), `piano.js` plays the sampled piano, `sloth.js` draws Mariah, `ui.js` is the tab bar, and `theme.css` is the design system. No build step.

Pitch detection runs in the browser with [Pitchy](https://github.com/ianprime0509/pitchy). Piano samples are from [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) (MIT). Nothing is recorded; practice history stays on your phone.

## Next

Mariah as a real ElevenLabs voice agent who talks you through the session.
