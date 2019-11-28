<style>
  #main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: calc(100vh - 40%);
    width: calc(100vw - 40%);
    padding: 15px;

    background-color: white;
    border-radius: 6px;
    box-shadow: 0 0 5px white;

    text-align: left;
  }

  span {
    display: block;
    margin-top: 20px;
  }

  button {
    margin-top: 15px;
    margin-right: 15px;
    padding: 10px;
    float: right;

    color: white;
    background-color: #16302b;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }

  button:hover {
    box-shadow: 0 0 5px #16302b;
  }

  #heading {
    font-size: 24px;
    font-weight: bolder;
  }

  #difficulty {
    position: absolute;
    right: 16px;
    top: 16px;
    height: 25px;
    width: 80px;
    padding: 5px;

    background: #1b3b6f;
    color: white;
    text-align: center;
    border-radius: 16px;
  }

  #category {
    font-size: 12px;
    font-weight: normal;
  }

  #button-bar {
    position: absolute;
    bottom: 16px;
    right: 0;
  }

  #choice {
    margin-top: 16px;
    padding: 8px;

    border: 1px solid #4e5656;
    border-radius: 8px;
  }

  #choice:hover {
    cursor: pointer;
    background: #7ddf64;
    border: 1px solid #7ddf64;
    color: white;
  }

  #snackbar {
    position: absolute;
    left: 16px;
    bottom: 24px;
  }

  #results {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);

    text-align: center;
  }

  #score {
    font-size: 48px;
  }

  @media screen and (max-width: 960px) {
    #main {
      width: calc(100vw - 15%);
      height: calc(100vh - 30%);
    }
    #difficulty {
      top: -16px;
    }
    #score {
      font-size: 36px;
    }
  }
</style>

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Snackbar from './Snackbar.svelte';

  import { fadeIn, fadeOut } from './transitions.js';
  import { htmlDecode, shuffle } from './utils.js';

  const dispatch = createEventDispatcher();
  let data = [];

  let questionNo = 0;
  let buttonBarVisibility = true;
  let snackbarVisibility = false;
  let snackbarMessage = false;
  // let answeredQuestions = 0;
  let resultsScreen = false;

  $: representation = [];
  $: score = 0;
  $: finalMessage = '';

  function fetchData() {
    fetch('https://opentdb.com/api.php?amount=10')
      .then(resp => resp.json())
      .then(res => {
        data = res.results;

        representation = data.reduce((acc, curr) => {
          acc.push({
            question: htmlDecode(curr.question),
            answerChoices: shuffle(
              [...curr.incorrect_answers, curr.correct_answer].map(ans =>
                htmlDecode(ans)
              )
            ),
            answer: htmlDecode(curr.correct_answer),
            category: htmlDecode(curr.category),
            difficulty: curr.difficulty,
            answerChoice: '',
            correct: false,
            answered: false
          });
          return acc;
        }, []);
      })
      .catch(e => console.error(e));
  }

  onMount(fetchData);

  function handleClick(change) {
    if (snackbarVisibility) snackbarVisibility = !snackbarVisibility;

    if (change === 'f') questionNo += 1;
    else questionNo -= 1;
  }

  function handleAnswerChoice(e = {}) {
    if (!representation[questionNo].answered) {
      // answeredQuestions += 1;
      const representationCopy = { ...representation[questionNo] };
      representationCopy.answered = true;
      if (e.target.innerText === representation[questionNo].answer) {
        representationCopy.correct = true;
        representationCopy.answerChoice = representation[questionNo].answer;
        representation[questionNo] = representationCopy;
        score += 1;
        snackbarMessage = true;
        dispatch('score', { score: score });
      } else {
        representationCopy.answerChoice = e.target.innerText;
        representation[questionNo] = representationCopy;
        snackbarMessage = false;
      }

      if (questionNo === 9) {
        buttonBarVisibility = false;
        resultsScreen = true;

        dispatch('resultsScreen', { showScore: false });

        if (score < 5) {
          finalMessage = 'Are you on drugs? 😵';
        } else if (score === 5) {
          finalMessage = "Don't give up try harder. 🤓";
        } else {
          finalMessage = "You're on fire!!! 🔥";
        }
      }

      if (!snackbarVisibility) snackbarVisibility = true;
    }
  }
</script>

<div id="main" in:fadeIn out:fadeOut>

  {#if representation.length > 0 && !resultsScreen}
    <span id="heading">
      Question {questionNo + 1}
      <i id="category">(Category - {representation[questionNo].category})</i>
    </span>
    <span>{representation[questionNo].question}</span>
    <div id="difficulty">{representation[questionNo].difficulty}</div>

    {#if representation[questionNo].answerChoices}
      {#each representation[questionNo].answerChoices as choice}
        {#if representation[questionNo].answered && representation[questionNo].correct}
          {#if choice === representation[questionNo].answerChoice}
            <div
              id="choice"
              style="background: #7DDF64; color: white; border-color: white">
              <i>{choice}</i>
            </div>
          {:else}
            <div id="choice">
              <i>{choice}</i>
            </div>
          {/if}
        {:else if representation[questionNo].answered && !representation[questionNo].correct}
          {#if choice === representation[questionNo].answer}
            <div
              id="choice"
              style="background: #7DDF64; color: white; border-color: white">
              <i>{choice}</i>
            </div>
          {:else}
            <div
              id="choice"
              style="background: #DE3C4B; color: white; border-color: white">
              <i>{choice}</i>
            </div>
          {/if}
        {:else}
          <div id="choice" on:click={e => handleAnswerChoice(e)}>
            <i>{choice}</i>
          </div>
        {/if}
      {/each}
    {/if}

    {#if buttonBarVisibility}
      <div id="button-bar">
        {#if questionNo < 9}
          <button value="Next" on:click={() => handleClick('f')}>Next</button>
        {/if}
        {#if questionNo > 0}
          <button value="Back" on:click={() => handleClick('b')}>
            Previous
          </button>
        {/if}
      </div>
    {/if}

    {#if snackbarVisibility}
      <div id="snackbar" in:fadeIn out:fadeOut>
        <Snackbar message={snackbarMessage} />
      </div>
    {/if}
    <!-- Uncomment this if you want the user to go back and answer pending questions
      {:else if answeredQuestions === 10}
      <p>All answered</p>
    -->
  {:else if resultsScreen}
    <div id="results">
      <p id="score">
        Final Score:
        <i>{score} / 10</i>
      </p>
      <p style="font-size: 24px">
        {@html finalMessage}
      </p>
      <p style="font-size: 24px">Refresh the page to play again</p>
    </div>
  {:else}
    <span
      style="position: absolute; left: 50%; top: 50%; transform:
      translateX(-50%) translateY(-50%); font-weight: bolder; font-size: 36px;
      margin: 0">
      Fetching questions...
    </span>
  {/if}

</div>
