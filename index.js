//クラス定義
class Quiz {
	constructor(quizData) {
		this.quizzes = quizData;
		this.correctAnswerNum = 0;
	}
	//クイズジャンルの取得
	getQuizGenre(index) {
		return this.quizzes[index - 1].category;
	}
	//クイズ難易度の取得
	getQuizDifficulty(index) {
		return this.quizzes[index - 1].difficulty;
	}
	//クイズ問題文の取得
	getQuizSentence(index) {
		return this.quizzes[index - 1].question;
	}
	//クイズ正答文の取得
	getCorrectAnswer(index) {
		return this.quizzes[index - 1].correct_answer;
	}
	//クイズ誤答文の取得
	getIncorrectAnswers(index) {
		return this.quizzes[index - 1].incorrect_answers;
	}
	//クイズ正答数の取得
	countCorrectAnswers(index, answer) {
		const correctAnswer = this.quizzes[index - 1].correct_answer;
		if (answer === correctAnswer) {
			return this.correctAnswerNum++;
		}
	}
}

const url = 'https://opentdb.com/api.php?amount=10&type=multiple';
const quizTitle = document.getElementById('title');
const quizGenre = document.getElementById('genre');
const quizDifficulty = document.getElementById('difficulty');
const quizSentence = document.getElementById('sentence');
const startButton = document.getElementById('start');
const answersArea = document.getElementById('answers');

//web apiの取得
const callApi = async (index) => {
	quizTitle.textContent = '取得中';
	quizSentence.textContent = 'しばらくお待ちください';

	const res = await fetch(url);
	const json = await res.json();
	const quizData = json.results;
	const quizInstance = new Quiz(quizData);
	setQuiz(quizInstance, index);
};

//クイズの出題数を管理する関数
const setQuiz = (quizInstance, index) => {
	while (answersArea.firstChild) {
		answersArea.removeChild(answersArea.firstChild);
	}
	const numOfQuizzes = quizInstance.quizzes.length;
	if (index <= numOfQuizzes) {
		createQuiz(quizInstance, index);
	} else {
		endQuiz(quizInstance);
	}
};

//クイズを作成する関数
const createQuiz = (quizInstance, index) => {
	quizTitle.textContent = `問題${index}`;
	quizGenre.textContent = `【ジャンル】${quizInstance.getQuizGenre(index)}`;
	quizDifficulty.textContent = `【難易度】${quizInstance.getQuizDifficulty(
		index
	)}`;
	quizSentence.textContent = `${quizInstance.getQuizSentence(index)}`;

	const answers = createAnswers(quizInstance, index);
	//選択肢のボタンを作成する
	answers.map((answer) => {
		const answerList = document.createElement('li');
		answersArea.appendChild(answerList);

		const answerButton = document.createElement('button');
		answerButton.innerText = answer;
		answerList.appendChild(answerButton);

		answerButton.addEventListener('click', () => {
			quizInstance.countCorrectAnswers(index, answer);
			index++;
			setQuiz(quizInstance, index);
		});
	});
};

//選択肢を配列に格納する関数
const createAnswers = (quizInstance, index) => {
	const correctAnswer = [quizInstance.getCorrectAnswer(index)];
	//配列を展開
	const incorrectAnswers = [...quizInstance.getIncorrectAnswers(index)];
	//配列を結合
	const answers = correctAnswer.concat(incorrectAnswers);
	shuffleAnswers(answers);
	return answers;
};

//配列をシャッフルする関数
const shuffleAnswers = (answers) => {
	for (i = answers.length; 1 < i; i--) {
		k = Math.floor(Math.random() * i);
		[answers[k], answers[i - 1]] = [answers[i - 1], answers[k]];
	}
};

//最後に出す画面を出力する関数
const endQuiz = (quizInstance) => {
	quizTitle.textContent = `あなたの正答数は${quizInstance.correctAnswerNum}です`;
	quizGenre.textContent = '';
	quizDifficulty.textContent = '';
	quizSentence.textContent = '再度チャレンジしたい場合は以下をクリック';

	const restartButton = document.createElement('button');
	restartButton.textContent = 'ホームに戻る';

	restartButton.addEventListener('click', () => {
		location.reload();
	});
	answersArea.appendChild(restartButton);
};

//開始ボタンを押した時のイベント
startButton.addEventListener('click', () => {
	startButton.hidden = true;
	callApi(1);
});
