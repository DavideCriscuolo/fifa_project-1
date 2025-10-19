# FUT MasterCoach (FUT 26) — Web App

## Panoramica

FUT MasterCoach è una single‑page web app React che aiuta a costruire e analizzare squadre per EA Sports FC 26 Ultimate Team (FUT). L'utente può cercare e selezionare giocatori (salvati in un "club" locale) e chiedere consigli tattici a un coach AI che analizza esclusivamente i dati dei giocatori forniti.

Scopo principale:

- Permettere all'utente di comporre una rosa di giocatori
- Fornire analisi tattiche, consigli su formazione/ruoli/intesa basati solo sulle statistiche presenti
- Usare un modello di linguaggio per generare suggerimenti in italiano

## Funzionalità principali

- Ricerca giocatori (pagina principale)
- Aggiungi/Rimuovi giocatori al club locale
- Chat con il Coach AI: invia la lista dei giocatori al modello e restituisce analisi in italiano
- Interfaccia semplice con Bootstrap e componenti React

## Tecnologia utilizzate

- React (functional components, hooks)
- Vite (dev server e build)
- Node.js / npm
- Bootstrap (stili / layout)
- @huggingface/inference (client per chiamare modelli HF)
- Modello usato : `HuggingFaceTB/SmolLM3-3B` (configurato in `CoachAi.jsx`)
- Fetch API per chiamate ai servizi di giocatori
- Icone: `@tabler/icons-react`

## Come funziona (flusso dati)

1. MainHome carica i giocatori via fetch dall'endpoint configurato e li mostra.
2. L'utente aggiunge giocatori al `club` (stato locale in MainHome).
3. MainHome passa `club` e `setClub` al componente `CoachAi`.
4. `CoachAi` serializza `club` nel prompt e invia la richiesta al modello HF via `startchat`.
5. Il modello risponde con testo: viene formattato e mostrato all'utente.
6. L'utente può rimuovere giocatori dal club direttamente dal componente `CoachAi`.
