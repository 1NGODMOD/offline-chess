import "./Board.css";
import { useAppContext } from "../../contexts/Context";
import io from "socket.io-client";
import Ranks from "./bits/Ranks";
import Files from "./bits/Files";
import Pieces from "../Pieces/Pieces";
import PromotionBox from "../Popup/PromotionBox/PromotionBox";
import Popup from "../Popup/Popup";
import GameEnds from "../Popup/GameEnds/GameEnds";

import arbiter from "../../arbiter/arbiter";
import { getKingPosition } from "../../arbiter/getMoves";
import { useEffect } from "react";

const socket = io.connect("http://localhost:5000");

const Board = () => {
  const ranks = Array(8)
    .fill()
    .map((x, i) => 8 - i);
  const files = Array(8)
    .fill()
    .map((x, i) => i + 1);

  const { appState } = useAppContext();
  const position = appState.position[appState.position.length - 1];
  //   console.log(position);
  function Redo() {
    const a = new Int8Array(64);
    let cur = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (position[i][j] === "") cur = 0;
        else if (position[i][j] === "wr") cur = 1;
        else if (position[i][j] === "wn") cur = 2;
        else if (position[i][j] === "wb") cur = 3;
        else if (position[i][j] === "wq") cur = 4;
        else if (position[i][j] === "wk") cur = 5;
        else if (position[i][j] === "wp") cur = 6;
        else if (position[i][j] === "bp") cur = 7;
        else if (position[i][j] === "br") cur = 8;
        else if (position[i][j] === "bn") cur = 9;
        else if (position[i][j] === "bb") cur = 10;
        else if (position[i][j] === "bq") cur = 11;
        else if (position[i][j] === "bk") cur = 12;

        a[i * 8 + j] = cur;
      }
    }
    return a;
  }
  // useEffect(() => {
  //   socket.on("connection", socket);
  //   console.log(position);
  //   console.log("wfdf");
  //   let arg = Redo();
  //   socket.emit("update", arg);
  //   console.log("send");
  // }, []);
  // useEffect(() => {
  //   // console.log(a, "change");
  // }, [position]);

  const checkTile = (() => {
    const isInCheck = arbiter.isPlayerInCheck({
      positionAfterMove: position,
      player: appState.turn,
    });

    if (isInCheck) return getKingPosition(position, appState.turn);

    return null;
  })();

  const getClassName = (i, j) => {
    let c = "tile";
    c += (i + j) % 2 === 0 ? " tile--dark " : " tile--light ";
    if (appState.candidateMoves?.find((m) => m[0] === i && m[1] === j)) {
      if (position[i][j]) c += " attacking";
      else c += " highlight";
    }

    if (checkTile && checkTile[0] === i && checkTile[1] === j) {
      c += " checked";
    }

    return c;
  };

  return (
    <div className="board">
      <Ranks ranks={ranks} />

      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div
              key={file + "" + rank}
              i={i}
              j={j}
              className={`${getClassName(7 - i, j)}`}
            ></div>
          ))
        )}
      </div>

      <Pieces />

      {/* <Popup>
        <PromotionBox />
        <GameEnds />
      </Popup> */}

      <Files files={files} />
    </div>
  );
};

export default Board;
