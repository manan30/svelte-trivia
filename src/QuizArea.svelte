<script>
  $: questionNo = 1;
</script>

<style>
  div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: calc(100vh - 40%);
    width: calc(100vw - 40%);
    padding: 15px;

    background-color: white;
    border-radius: 6px;
    box-shadow: 1px 1px 10px floralwhite;

    text-align: left;
  }

  span {
    display: block;
    margin-top: 20px;
  }

  #heading {
    font-size: 24px;
    font-weight: bolder;
  }
</style>

<div>
  <span id="heading">Question {questionNo}</span>
  <span>This is a super super long question</span>
</div>
