# MariahTheVoiceCoach
AI voice coach for singers: daily agility warmups, real-time pitch scoring, and an ElevenLabs voice agent as your teacher.

## Try it

Open **https://zahraquettawala.github.io/MariahTheVoiceCoach/** on your phone in Safari, tap **Start**, allow the microphone, and sing.

## Status

Step 1, the pitch test (home page): shows the note you are singing, a too low / on it / too high meter, a line of your pitch, and a piano reference note to match.

Step 2, the warmup (warmup.html): a sing-along. The piano plays a 5-note scale up and down with you, starting with a hum and then "Ah". After each loop you get quick spoken feedback (flat, sharp, or on pitch), then it moves up a half step, climbs, and comes back down. Wear wired earbuds so the mic hears you, not the piano.

Pitch detection runs in the browser with [Pitchy](https://github.com/ianprime0509/pitchy). Piano samples are from [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) (MIT). Nothing is recorded or saved; the sound stays on your phone.
