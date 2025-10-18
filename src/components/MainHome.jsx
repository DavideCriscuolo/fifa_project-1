import { useState } from "react";
import { useEffect } from "react";
import CoachAi from "./CoachAi";
import { IconArrowBadgeRight, IconArrowBadgeLeft } from "@tabler/icons-react";
export default function MainHome() {
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [club, setClub] = useState([]);
  const [player, setPlayer] = useState({
    namePlayer: "",
  });
  const desc = [
    "FUT MasterCoach è la tua web app personale per EA Sports FC 26 Ultimate Team.",
    "Seleziona i tuoi giocatori preferiti, costruisci la tua squadra ideale e ricevi consigli tattici e analisi strategiche in tempo reale dal tuo coach ai.",
    " Ottimizza formazione, ruoli e intesa della squadra con suggerimenti basati esclusivamente sulle statistiche dei tuoi giocatori.",
  ];
  console.log("Giocatori del club" + club);
  function gnrPlayers() {
    let url = import.meta.env.VITE_GNR_PLAYERS + page;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data.data);
        //console.log(data.data);
      })

      .catch((error) => console.error(error));
  }
  console.log(players);
  useEffect(gnrPlayers, [page]);

  function serachName(e) {
    //console.log(player);
    e.preventDefault();
    setPlayer(e.target.value);
    const url = import.meta.env.VITE_SRC_PLAYER + player.name;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    })
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data.data);
        //console.log(data.data);
      })
      .catch((error) => console.error(error));
  }
  return (
    <main>
      <div className="container py-5">
        <h1 className="text-center ">FUT MasterCoach</h1>
        <div>
          {" "}
          {desc.map((t) => {
            return <p className="text-center mb-1"> {t}</p>;
          })}
        </div>

        {page === 0 && <h1 className="text-danger">Non ci sono giocatori</h1>}
        <div className="py-4">
          {" "}
          <form className="" onSubmit={serachName}>
            <label htmlFor="formControlInput" className="form-label">
              Qui puoi cercare i giocatori per nome
            </label>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Inserisci il nome del giocatore"
              aria-label="cerca"
              onChange={(e) => setPlayer({ namePlayer: e.target.value })}
            />
            <button className="btn my-2 " type="submit">
              Cerca
            </button>
          </form>
        </div>

        <div>
          {players.length == 0 && (
            <h2 className="text-center py-5">
              Non ci sono giocatori con questo nome{" "}
            </h2>
          )}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
            {players.map((player) => {
              return (
                <div className="col">
                  <div className="card  bg-transparent border-0 text-white">
                    <img
                      className="card-img-top"
                      src={player.cardImageUrl}
                      alt="Title"
                    />
                    <div className="card-body p-2 text-center ">
                      <div>
                        {" "}
                        <button
                          className="btn my-4 fw-semibold"
                          onClick={(e) => {
                            e.preventDefault();
                            setClub([...club, player]);
                          }}
                        >
                          Aggiungi al club
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            {" "}
            <CoachAi club={club}></CoachAi>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-2">
          {" "}
          <button
            onClick={() => setPage(page - 1)}
            className={`btn  ${page === 1 && "disabled"}`}
          >
            <IconArrowBadgeLeft></IconArrowBadgeLeft>
          </button>
          <button onClick={() => setPage(page + 1)} className="btn ">
            <IconArrowBadgeRight></IconArrowBadgeRight>
          </button>{" "}
        </div>
      </div>
    </main>
  );
}
