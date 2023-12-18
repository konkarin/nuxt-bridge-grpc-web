import { shallowMount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";

import App from "~/pages/index.vue";

import { server } from "@/mocks/server";

server.listen();

describe("index.vue", () => {
  const wrapper = shallowMount(App) as any;

  test("initial render", () => {
    expect(wrapper.html()).toContain("grpc-web sandobox");
  });

  test("exec sendMsg", async () => {
    await wrapper.vm.sendMsg("hello");
    expect(wrapper.vm.msgs.length).toBe(1);
    expect(wrapper.vm.msgs[0]).toBe("Hello world");
  });
});
