# Vue-forms

## Introduction

This package provides a powerful and flexible solution for creating model-driven forms in Vue applications. By utilizing this package, developers can easily build complex forms with dynamic validation and conditional logic, all driven by a central model.

## Features

- **Type Safety**: Leverage TypeScript to ensure that your forms are type-safe, reducing runtime errors and improving developer experience.
- **Model-Driven Forms**: Define your forms structure through models, making form creation more intuitive and less error-prone.
- **Zod Validations**: Utilize Zod's comprehensive validation capabilities to enforce a wide array of constraints and custom validations.

## Installation and usage

First install vue-forms:

```bash
npm i @deadcow-enterprises/vue-forms
yarn add @deadcow-enterprises/vue-forms
pnpm add @deadcow-enterprises/vue-forms
```

## Usage

```javascript
<template>
  <form @submit="form.handleSubmit(login)($event)">
    <label for="username">
      <input
        type="text"
        name="username"
        id="username"
        :value="form.value.username"
        @input="
          form.setValue(
            'username',
            typedTarget<HTMLInputElement>($event.target)?.value ?? ''
          )
        "
      />
      <template v-if="form.errors.username">
        <span
          className="error"
          v-for="(err, index) in form.errors.username"
          :key="index"
        >
          {{ err }}
        </span>
      </template>
    </label>

    <label for="password">
      <input
        type="text"
        name="password"
        id="password"
        :value="form.value.password"
        @input="
          form.setValue(
            'password',
            typedTarget<HTMLInputElement>($event.target)?.value ?? ''
          )
        "
      />
      <template v-if="form.errors.password">
        <span
          className="error"
          v-for="(err, index) in form.errors.password"
          :key="index"
        >
          {{ err }}
        </span>
      </template>
    </label>
    <button>Submit</button>
  </form>
</template>
<script setup lang="ts">
import { typedTarget, useForm } from "@deadcow-enterprises/vue-forms";
import { z } from "zod";
type LoginModel = {
  username: string;
  password: string;
};

const form = useForm<LoginModel>({
  username: {
    value: "",
    validator: z.string().min(1, "Username is required"),
  },
  password: {
    value: "",
    validator: z.string().min(1, "Password is required"),
  },
});

const login = (formValue: LoginModel) => {
  // do something with formValue here like send it to the server
  console.log(formValue);
};
</script>
<style>...</style>
```
