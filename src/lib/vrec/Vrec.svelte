<script>
  import VoiceToText from './VoiceToText.svelte';
  import TextToVoice from './TextToVoice.svelte';

  let transcript = '';
</script>

<div>
  <VoiceToText  bind:transcript={transcript}/>
  <TextToVoice bind:text={transcript}/>
</div>