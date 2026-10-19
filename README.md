# MariahTheVoiceCoach
AI voice coach for singers: daily agility warmups, real-time pitch scoring, and an ElevenLabs voice agent as your teacher.

## Try it

Open **https://zahraquettawala.github.io/MariahTheVoiceCoach/** on your phone in Safari, tap **Start**, allow the microphone, and sing.

## Status

Step 1, the pitch test (home page): shows the note you are singing, a too low / on it / too high meter, a line of your pitch, and a piano reference note to match.

Step 2, the warmup (warmup.html): the piano plays a pattern (5-note scale, arpeggio, or little runs), you sing it back, and each note is scored. Pick the starting note and speed, then move up or down a half step each round.

Pitch detection runs in the browser with [Pitchy](https://github.com/ianprime0509/pitchy). Piano samples are from [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) (MIT). Nothing is recorded or saved; the sound stays on your phone.
