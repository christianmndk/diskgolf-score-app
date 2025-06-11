import React, { useState, useEffect } from "react";

// Key names used in localStorage
const STORAGE_KEY = "diskgolf_players";
const PREVIOUS_NAMES_KEY = "diskgolf_previous_names";

export default function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [newPlayerFields, setNewPlayerFields] = useState([""]);
  const [previousNames, setPreviousNames] = useState(() => {
    const saved = localStorage.getItem(PREVIOUS_NAMES_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isEditing, setIsEditing] = useState(false);
  const [holeScores, setHoleScores] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
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
    const names = newPlayers.map(p => p.name);
    setPreviousNames(names);
    localStorage.setItem(PREVIOUS_NAMES_KEY, JSON.stringify(names));
    setIsEditing(false);
    setHoleScores([]);
  };

  const startNewHole = () => {
    setHoleScores(players.map(() => 0));
    setIsEditing(true);
  };

  const adjustHoleScore = (index, delta) => {
    const updatedPlayers = [...players];
    const updatedHole = [...holeScores];
    updatedHole[index] += delta;
    updatedPlayers[index].score += delta;
    setHoleScores(updatedHole);
    setPlayers(updatedPlayers);
  };

  const finishHole = () => {
    const updatedPlayers = players.map((p, i) => ({
      ...p,
      history: [...p.history, holeScores[i] || 0],
    }));
    setPlayers(updatedPlayers);
    setIsEditing(false);
    setHoleScores([]);
  };

  const clearGame = () => {
    if (confirm("Er du sikker på, at du vil nulstille spillet?")) {
      const names = players.map(p => p.name);
      setPreviousNames(names);
      localStorage.setItem(PREVIOUS_NAMES_KEY, JSON.stringify(names));
      setPlayers([]);
      setNewPlayerFields([""]);
      localStorage.removeItem(STORAGE_KEY);
      setIsEditing(false);
      setHoleScores([]);
    }
  };

  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);
  const rankedPlayers = sortedPlayers.reduce((acc, player, index) => {
    if (index === 0) {
      acc.push({ ...player, rank: 1 });
    } else {
      const prev = acc[index - 1];
      const rank = player.score === prev.score ? prev.rank : prev.rank + 1;
      acc.push({ ...player, rank });
    }
    return acc;
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Diskgolf Score App</h1>

      {players.length === 0 && (
        <div>
          <h2 className="text-lg mb-2">Tilføj spillere</h2>
          <datalist id="nameSuggestions">
            {previousNames.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
          {newPlayerFields.map((name, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Spiller ${i + 1}`}
              className="w-full text-xl p-4 border rounded mb-3"
              value={name}
              onChange={e => updateNewPlayerName(i, e.target.value)}
              list="nameSuggestions"
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
          {isEditing && (
            <>
              {players.map((player, i) => (
                <div key={i} className="flex items-center justify-between mb-4 bg-gray-100 p-4 rounded">
                  <span className="text-2xl font-bold truncate max-w-[50%]">{player.name}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => adjustHoleScore(i, -1)}
                      className="bg-red-500 text-white text-xl px-4 py-2 rounded"
                    >–</button>
                    <span className="text-3xl font-bold w-10 text-center">{player.score}</span>
                    <button
                      onClick={() => adjustHoleScore(i, 1)}
                      className="bg-green-600 text-white text-2xl px-5 py-2 rounded"
                    >+</button>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Stilling</h2>
            {rankedPlayers.map((p, i) => (
              <div
                key={i}
                className={`p-3 rounded mb-2 ${p.rank === 1 ? "text-yellow-600 text-2xl font-bold" : p.rank === 2 ? "text-gray-500 text-xl" : p.rank === 3 ? "text-orange-500 text-xl" : "text-gray-800 text-lg"}`}
              >
                #{p.rank} {p.name}: {p.score} point
              </div>
            ))}
          </div>

          {isEditing ? (
            <button
              onClick={finishHole}
              className="mt-8 w-full bg-blue-600 text-white text-lg p-3 rounded"
            >
              Færdig
            </button>
          ) : (
            <button
              onClick={startNewHole}
              className="mt-8 w-full bg-blue-600 text-white text-lg p-3 rounded"
            >
              Nyt hul
            </button>
          )}

          <button
            onClick={clearGame}
            className="mt-4 w-full bg-red-600 text-white text-lg p-3 rounded"
          >
            Nulstil spillet
          </button>
        </>
      )}
    </div>
  );
}
