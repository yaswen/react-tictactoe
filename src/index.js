import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//函数定义组件,square,是每一个小方框,采用button形成.
//假如一个组件仅有render方法时,可以改为函数定义组件.
//props.onClick是从父组件传递过来的参数，传过来应该是一个方法。
//于是return的这个button在被点击的时候就触发这个父组件传递过来的方法.
//button上面显示的value也是父组件通过传参数传递过来的一个值.
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/**
 *棋盘组件
 */
class Board extends React.Component {
    //画格子方法,返回一个square组件,传进来的i表示格子的编号,
    //并将父组件传过来的squares参数中取的squares[i]（也就是第i个格子中的值）传给square组件。
    //同时onClick参数是传下去一个onClick(i)方法,这个方法也是父组件传过来的。
    //(见到props就知道是父组件传过来的,通过写<xx pp=vv/>这种格式的东西传过来的)。
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    //返回三行div,每行里面执行三次renderSquare方法,用以生成一个格子.renderSquare的参数i是在这里写死的
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    //初始化构造函数,继承了Component的class会在初始化时候自动运行这个函数.
    //super()必写，写了才能正确取到this(不太懂)
    //this.state={k:v}用于设置状态,这里将history设为一个数组,数组目前仅一项,也是一个{},里面一个键值对,
    //键是squares,值是长度为9的填满了null的一个数组.
    //顾名思义,history用于记录历史局面.
    //是一个数组,数组里每一项是一个{},里面一个键值对,键为squares,值是一个长度为9的表示一个局面的数组.
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
        };
    }
    //handleClick方法,表示点击了第i个格子
    //concat方法用于连接两个数组,产生一个新的数组
    //slice()方法此处浅拷贝,不可变性此处较重要,值得深思.
    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />

                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

//判断当前局面有没有人赢了.
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}