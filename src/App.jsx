import React, { useState, useEffect } from "react";

export default function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("diskgolf_players");
    return saved ? JSON.parse(saved) : [];
  });
  const [newPlayerFields, setNewPlayerFields] = useState([""]);

  useEffect(() => {
    localStorage.setItem("diskgolf_players", JSON.stringify(players));
  }, [players]);

  const addNewPlayerField = () => {
    setNewPlayerFields([...newPlayerFields, ""]);
  };

  const updateNewPlayerName = (index, name) => {
    const updated = [...newPlayerFields];
    updated[index] = name;
    setNewPlayerFields(updated);
  };

  const startGame = () => {
    const newPlayers = newPlayerFields
      .map(name => name.trim())
      .filter(name => name !== "")
      .map(name => ({ name, score: 0, history: [] }));
    setPlayers(newPlayers);
  };

  const adjustScore = (index, delta) => {
    const updated = [...players];
    updated[index].score += delta;
    updated[index].history.push({ change: delta });
    setPlayers(updated);
  };

  const clearGame = () => {
    if (confirm("Er du sikker på, at du vil nulstille spillet?")) {
      setPlayers([]);
      setNewPlayerFields([""]);
      localStorage.removeItem("diskgolf_players");
    }
  };

  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Diskgolf Score App</h1>

      {players.length === 0 && (
        <div>
          <h2 className="text-lg mb-2">Tilføj spillere</h2>
          {newPlayerFields.map((name, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Spiller ${i + 1}`}
              className="w-full text-xl p-4 border rounded mb-3"
              value={name}
              onChange={e => updateNewPlayerName(i, e.target.value)}
            />
          ))}
          <button
            onClick={addNewPlayerField}
            className="w-full bg-gray-200 text-black text-lg p-3 rounded mb-2"
          >
            Tilføj en spiller
          </button>
          <button
            onClick={startGame}
            className="w-full bg-blue-600 text-white text-lg p-3 rounded"
          >
            Start spil
          </button>
        </div>
      )}

      {players.length > 0 && (
        <>
          {players.map((player, i) => (
            <div key={i} className="flex items-center justify-between mb-4 bg-gray-100 p-4 rounded">
              <span className="text-2xl font-bold truncate max-w-[50%]">{player.name}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => adjustScore(i, -1)}
                  className="bg-red-500 text-white text-xl px-4 py-2 rounded"
                >–</button>
                <span className="text-3xl font-bold w-10 text-center">{player.score}</span>
                <button
                  onClick={() => adjustScore(i, 1)}
                  className="bg-green-600 text-white text-2xl px-5 py-2 rounded"
                >+</button>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Stilling</h2>
            {sortedPlayers.map((p, i) => (
              <div
                key={i}
                className={`p-3 rounded mb-2 ${i === 0 ? "text-yellow-600 text-2xl font-bold" : i === 1 ? "text-gray-500 text-xl" : i === 2 ? "text-orange-500 text-xl" : "text-gray-800 text-lg"}`}
              >
                {i < 3 ? `#${i + 1} ` : ""}
                {p.name}: {p.score} point
              </div>
            ))}
          </div>

          <button
            onClick={clearGame}
            className="mt-8 w-full bg-red-600 text-white text-lg p-3 rounded"
          >
            Nulstil spillet
          </button>
        </>
      )}
    </div>
  );
}
