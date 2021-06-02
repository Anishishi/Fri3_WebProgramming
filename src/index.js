import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function NumBtn(props) {
    return (
        <button className="numbtn" onClick={props.onClick}>{props.n}</button>
    )
};

// 1~9の数字を選択する用のボード
class Numbers extends Component {

    render() {
        return (
            <div>
                <div>
                    <NumBtn n={1} onClick={() => this.props.onClick(1)}/>
                    <NumBtn n={2} onClick={() => this.props.onClick(2)}/>
                    <NumBtn n={3} onClick={() => this.props.onClick(3)}/>
                </div>
                <div>
                    <NumBtn n={4} onClick={() => this.props.onClick(4)}/>
                    <NumBtn n={5} onClick={() => this.props.onClick(5)}/>
                    <NumBtn n={6} onClick={() => this.props.onClick(6)}/>
                </div>
                <div>
                    <NumBtn n={7} onClick={() => this.props.onClick(7)}/>
                    <NumBtn n={8} onClick={() => this.props.onClick(8)}/>
                    <NumBtn n={9} onClick={() => this.props.onClick(9)}/>
                </div>
                <div>
                    <NumBtn n={"削除"} onClick={() => this.props.onClick("")}/>
                </div>
            </div>
        )
    }
}

function Square(props) {
    return (
        <button id={String(props.idInt)} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    // 格子の要素を作成する
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                idInt={i}
            />
        );
    }

    // 格子の列要素をfor文で作成する．
    renderRow = (start, end) => {
		const rowSquares = [];
		for (let i = start; i <= end; i++) {
			rowSquares.push(this.renderSquare(i));
		}
		return rowSquares;
	}

    render() {
        return (
        // マス目の描画
        <div>
            <div className="board-row">
                {this.renderRow(0,8)}
            </div>
            <div className="board-row">
                {this.renderRow(9,17)}
            </div>
            <div className="board-row">
                {this.renderRow(18,26)}
            </div>
            <div className="board-row">
                {this.renderRow(27,35)}
            </div>
            <div className="board-row">
                {this.renderRow(36,44)}
            </div>
            <div className="board-row">
                {this.renderRow(45,53)}
            </div>
            <div className="board-row">
                {this.renderRow(54,62)}
            </div>
            <div className="board-row">
                {this.renderRow(63,71)}
            </div>
            <div className="board-row">
                {this.renderRow(72,80)}
            </div>
        </div>
        );
    }
}

// ゲーム初期化用
class InitializeGame extends React.Component {
    
    render() {
        return (
            <div>
                <button className="btn" onClick={this.props.onClick}>Start Game</button>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(81).fill(""),
            filledNum: 0,
            selected: -1,
        };
    }

    // ひとまずハードコーディングする．
    initialSquares = [5, 3, 4, 6, 7, 8, 9, 1, 2,
        6, 7, 2, 1, 9, 5, 3, 4, 8,
        1, 9, 8, 3, 4, 2, 5, 6, 7,
        8, 5, 9, 7, 6, 1, 4, 2, 3,
        4, 2, 6, 8, 5, 3, 7, 9, 1,
        7, 1, 3, 9, 2, 4, 8, 5, 6,
        9, 6, 1, 5, 3, 7, 2, 8, 4,
        2, 8, 7, 4, 1, 9, 6, 3, 5,
        3, 4, 5, 2, 8, 6, 1, 7, 9];

    // 数字を書き換えるための関数
    onClickHandlerNum(i) {
        const squares = this.state.squares.slice();
        if (this.state.selected === -1) {
            const cnt = countFill(this.state.squares);
            this.setState({filledNum: cnt});
            return;
        }
        squares[this.state.selected] = i
        const cnt = countFill(squares);
        this.setState({
            squares: squares,
            filledNum: cnt,
        });
    }

    // 初期化するためのハンドラー
    handleInit() {
        const newSqueares = makeProblem(this.initialSquares.slice());
        this.setState({squares: newSqueares});
    }

    // 数字を入れるマスを決める
    handleClick(i) {
        if (i === this.state.selected) {
            return;
        }
        if (!(i === -1)) {
            document.getElementById(String(i)).style.backgroundColor = "orange";
        }
        if (!(this.state.selected === -1)) {
            document.getElementById(String(this.state.selected)).style.backgroundColor = "white";
        }
        this.setState({
            selected: i,
        });
    }

    // rendering用
    render() {
        const isCorrect = calculateWinner(this.state.squares);
        let status;
        if (isCorrect && this.state.filledNum === 81){
            status = "congratulations!!!"
        } else if (isCorrect){
            status = "Filled: "+String(this.state.filledNum)+"\nNow correct";
        }else{
            status = "Something wrong...!"
        }

        return (
            <div>
                <h2 className="title">Sudoku</h2>
                <div className="game">
                    {/* 数独のボード */}
                    <div className="game-board">
                    <Board
                        squares={this.state.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                    {/* リセットする */}
                    <InitializeGame
                        onClick={(i) => this.handleInit(i)}
                    />
                    {/* ゲームの進行状況 */}
                    </div>
                    <div className="game-info">
                    <div>{status}</div>
                    {/* 1~9の数字を選択する用のボード */}
                    <Numbers
                        squares={this.state.squares}
                        onClick={(i) => this.onClickHandlerNum(i)}
                    />
                    </div>
                </div>
            </div>
        );
    }
}

// 埋まっているマス目の数を数える
function countFill(square) {
    let cnt = 0;
    for (let h=0; h<9; h++){
        for (let w=0; w<9; w++) {
            if (square[h*9+w] !== ""){
                cnt += 1
            }
        }
    }
    return cnt
}

function calculateWinner(squares) {
    // 全ての数字が正しく埋まっているかの判定
    // 横方向
    for (let h=0; h<9; h++) {
        let lines = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let w=0; w<9; w++){
            if (squares[h*9+w] !== "") {
                if (lines[squares[h*9+w]] ===  1) {
                    return false
                }else{
                    lines[squares[h*9+w]] = 1
                }
            }
        }
    }
    // 縦方向
    for (let w=0; w<9; w++) {
        let lines = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let h=0; h<9; h++){
            if (squares[h*9+w] !== "") {
                if (lines[squares[h*9+w]] ===  1) {
                    return false
                }else{
                    lines[squares[h*9+w]] = 1
                }
            }
        }
    }
    // 9区画のます
    const linesCandidate = [
        [0, 1, 2, 9, 10, 11, 18, 19, 20],
        [3, 4, 5, 12, 13, 14, 21, 22, 23],
        [6, 7, 8, 15, 16, 17, 24, 25, 26],
        [27, 28, 29, 36, 37, 38, 45, 46, 47],
        [30, 31, 32, 39, 40, 41, 48, 49, 50],
        [33, 34, 35, 42, 43, 44, 51, 52, 53],
        [54, 55, 56, 63, 64, 65, 72, 73, 74],
        [57, 58, 59, 66, 67, 68, 75, 76, 77],
        [60, 61, 62, 69, 70, 71, 78, 79, 80]
    ];
    for (let i=0; i<9; i++){
        let lines = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let j=0; j<9; j++){
            const ind = linesCandidate[i][j];
            if (squares[ind] !== "") {
                if (lines[squares[ind]] ===  1) {
                    return false
                }else{
                    lines[squares[ind]] += 1
                }
            }
        }
    }
    return true
}

function makeProblem(squares) {
    // ランダムなindexのリストを作成する
    var array = Array(81).fill(0);
    for (let i = 0; i<81; i++){
        array[i] = i
    }
    for(let i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    // indexのリスト前から見ていき，そこに相当するマスの数字を消していく．簡単のためにとりあえず適当に消す．
    // 難易度もどうなるかわからない．
    for (let i=0; i<45; i++){
        const ind = array[i]
        squares[ind] = ""
    }
    return squares
}



// ========================================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

/*
export Board;
export Game;
*/
