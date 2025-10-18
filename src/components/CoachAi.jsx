import { useState } from "react";
import { InferenceClient } from "@huggingface/inference";

export default function CoachAi(props) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  const apiKei = import.meta.env.VITE_HF_API_KEY;
  const clubData = JSON.stringify(props.club, null, 2);

  const coachPrompt = `Sei **Coach FUT 26**, un assistente virtuale esperto di EA Sports FC 26 Ultimate Team.

L’utente ti fornisce la seguente **lista di giocatori** in formato JSON:

${clubData}

Ogni oggetto contiene almeno:
- nome
- ruolo
- valutazione
- club
- nazionalità
- eventuali statistiche (es. velocità, tiro, passaggio, dribbling, difesa, fisico).

Devi comportarti come un **allenatore e analista** esperto di FUT 26, rispondendo **solo in lingua italiana** e **solo** in relazione ai giocatori presenti nella lista.

[... resto del prompt invariato ...]

### Regole di comportamento:
1. **Se la lista dei giocatori è vuota**, rispondi sempre in modo chiaro e diretto:
   > "Per favore, seleziona prima i giocatori che vuoi analizzare cliccando sul bottone 'Aggiungi al club'."
2. Rispondi sempre in italiano, in modo naturale, da vero coach esperto ma amichevole.
3. Puoi analizzare la squadra, consigliare miglioramenti, parlare di intesa, ruoli o strategie di gioco, ma **non inventare giocatori o dati non presenti nell’array**.
4. Se l’utente fa domande su giocatori o argomenti esterni alla lista fornita, rispondi:
   > "Mi dispiace, posso analizzare solo i giocatori che mi hai fornito."
5. Puoi confrontare giocatori tra loro **solo** se entrambi sono nella lista.
6. Se l’utente chiede un consiglio tattico (formazione, ruolo, stile di intesa, ecc.), basati **solo sulle statistiche presenti negli oggetti**.
7. Evita ogni riferimento a dati o API esterne (es. FUTBIN, EA API, prezzi, mercato).
8. Non usare inglese o abbreviazioni da codice, rispondi sempre come un **coach umano**, chiaro e tecnico.

`;

  // Funzione per formattare la risposta
  const formatAnswer = (text) => {
    if (!text) return null;

    // Dividi in paragrafi
    const paragraphs = text.split("\n").filter((p) => p.trim());

    return paragraphs.map((paragraph, index) => {
      // Se è una lista puntata
      if (
        paragraph.trim().match(/^[-*•]\s/) ||
        paragraph.trim().match(/^\d+\.\s/)
      ) {
        return (
          <li key={index} className="mb-2 list-unstyled">
            {paragraph.replace(/^[-*•]\s/, "").replace(/^\d+\.\s/, "")}
          </li>
        );
      }

      // Se sembra un titolo (termina con : e è corto)
      if (paragraph.trim().endsWith(":") && paragraph.length < 80) {
        return (
          <h6 key={index} className="fw-bold  mt-3 mb-2">
            {paragraph}
          </h6>
        );
      }

      // Paragrafo normale
      return (
        <p key={index} className="mb-3">
          {paragraph}
        </p>
      );
    });
  };

  async function startchat(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const client = new InferenceClient(apiKei);
      const chatCompletion = await client.chatCompletion({
        provider: "hf-inference",
        model: "HuggingFaceTB/SmolLM3-3B",
        messages: [
          {
            role: "system",
            content: coachPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
      });

      let message =
        chatCompletion.choices?.[0]?.message?.content ||
        "Nessuna risposta trovata";
      console.log(message);
      // Rimuovi <think> e **
      message = message
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/\*\*(.*?)\*\*/g, "$1") // Rimuove ** e mantiene il contenuto
        .trim();
      setAnswer(message);
    } catch (err) {
      console.error(err);
      setError("Errore durante la chiamata al modello");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container d-flex justify-content-center py-2">
      <div className={`chatbot-container show w-100`}>
        <div className="card ">
          <div className="card-body   ">
            <h1 className="text-center">MasterCoach</h1>

            {/* Visualizzazione migliorata della risposta */}
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : answer ? (
              <div className="answer-container  bgCustom rounded p-3 mb-3 ">
                <div className="answer-content">{formatAnswer(answer)}</div>
              </div>
            ) : null}

            {!answer && !loading && (
              <div>
                <p className="text-center fst-italic">
                  Seleziona i tuoi giocatori e chiedimi tutto ciò che vuoi:
                  suggerimenti sui moduli da utilizzare, strategie di squadra e
                  molto altro.
                </p>
              </div>
            )}
            <div>
              <div className="borderCustom my-2 p-2">
                <h5 className="">Il tuo Club</h5>
                <div className="d-flex gap-2 flex-wrap py-2">
                  {props.club && props.club.length > 0 ? (
                    props.club.map((player, index) => (
                      <div key={index}>
                        <span className="badge bgCustom text-black">
                          {player.commonName}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>Nessun giocatore selezionato</p>
                  )}
                </div>
              </div>
            </div>
            <form action="" onSubmit={startchat}>
              <textarea
                className="form-control"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Fai la tua domanda..."
              />
              <button
                type="submit"
                className=" my-3 btn text-black "
                disabled={loading}
              >
                {loading ? "Sto pensando..." : "Chiedi"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
