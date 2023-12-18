<script setup lang="ts">
import { ref } from "vue";

import { say } from "~/apis/eliza";

const inputValue = ref("hello");
const msgs = ref<string[]>([]);

const sendMsg = async (msg: string) => {
  const res = await say(msg).catch((e) => {
    console.error(e);
    return null;
  });

  if (res) {
    msgs.value.push(res.getSentence());
  }
};

defineExpose({ msgs, sendMsg });
</script>

<template>
  <div>
    <h1>grpc-web sandobox</h1>
    <div>
      <input v-model="inputValue" />
      <button @click="sendMsg(inputValue)">send</button>
    </div>
    <div v-for="msg in msgs">{{ msg }}</div>
  </div>
</template>
