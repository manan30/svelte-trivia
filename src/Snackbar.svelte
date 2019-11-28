<style>
  div {
    height: 48px;
    width: 344px;
    padding: 0 16px;

    line-height: 45px;
    background-color: #4e5656;
    border-radius: 5px;

    box-shadow: 0 0 5px #4e5656;
  }

  span {
    font-size: 16px;
    color: white;
  }
</style>

<script>
  export let message = '';
</script>

{#if message}
  <div style="background-color: green; box-shadow: 0 0 5px green;">
    <span>Correct Answer</span>
  </div>
{:else}
  <div style="background-color: red; box-shadow: 0 0 5px red;">
    <span>Incorrect Answer</span>
  </div>
{/if}
