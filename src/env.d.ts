/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: D1Database;
      };
    };
  }
}
