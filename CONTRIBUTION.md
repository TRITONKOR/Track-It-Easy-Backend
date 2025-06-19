# 🙌 Introduction

Hi there — and thank you for your interest in contributing to **Track It Easy**! We're thrilled that you're considering helping us improve this project 💪

**Track It Easy** is a package tracking system built with Fastify and TypeScript, following a clean architecture with clear layers: `app`, `domain`, `infra`, and `api`. Your contributions can take many forms — from writing code and tests to improving documentation or providing helpful feedback.

> **You don’t have to write code to support the project.** You can also:
>
> -   ⭐ Star this repository
> -   📢 Share the project on social media
> -   📄 Mention the project in your own README
> -   👥 Recommend it at meetups or to colleagues

We aim to make contributing a welcoming, transparent, and productive experience for everyone involved. The sections below will guide you through the process — whether you're fixing bugs, building new modules, or improving the docs.

Together, we can make **Track It Easy** a reliable, scalable, and helpful tool for thousands of users 🚀

## 🗂️ Table of Contents

-   [I Have a Question](#i-have-a-question)
-   [I Want to Contribute](#i-want-to-contribute)
    -   [Reporting Bugs](#reporting-bugs)
    -   [Suggesting Enhancements](#suggesting-enhancements)
    -   [Creating a New Module](#creating-a-new-module)
    -   [Improving the Documentation](#improving-the-documentation)
-   [Style Guide](#style-guide)
    -   [Project Architecture](#project-architecture)
    -   [Interface Structure](#interface-structure)
    -   [Commit Messages](#commit-messages)
-   [Join the Project Team](#join-the-project-team)
-   [Attribution](#attribution)

## ❓ I Have a Question

If you're unsure about something or need clarification while working with this project, we're here to help! But before opening a new issue, please take a few moments to check the following:

---

### 🔍 Check Before Asking

1. **Read the documentation** — It may already contain the answer.
2. **Search existing [GitHub Issues](https://github.com/TRITONKOR/Track-It-Easy-Backend/issues)** — Your question might have been asked before.
3. **Look for open discussions or related PRs** — Someone else might already be working on a similar idea.

---

### 📝 How to Ask

If you still have a question and didn't find a relevant answer:

-   **Open a new [Issue](https://github.com/TRITONKOR/Track-It-Easy-Backend/issues/new)** using the "Question" label.
-   Include a **clear and concise title**.
-   Provide **as much context as possible** (e.g. what you're trying to do, what you've tried, and what isn't working).
-   If applicable, mention:
    -   Operating system
    -   Node.js version
    -   Package versions
    -   Any relevant logs or code snippets

---

### 🙏 Tips for Better Answers

-   Be specific — Vague questions are harder to help with.
-   Include examples — If possible, share reproducible code.
-   Be patient — We’ll try to respond as quickly as we can.

> 🤝 Pro tip: Helping others by answering open questions is also a great way to contribute!

## 🛠️ I Want to Contribute

We welcome all kinds of contributions — whether you're fixing a bug, adding a feature, improving documentation, or just sharing feedback. Please follow the guidelines below to help us review your contribution smoothly and efficiently.

---

### 🐛 Reporting Bugs

Before submitting a bug report:

1. **Make sure you're using the latest version.**
2. **Check the existing [issues](https://github.com/TRITONKOR/Track-It-Easy-Backend/issues)** to see if your problem is already known.
3. **Try to reproduce the bug consistently.**

When reporting a bug, please include:

-   A clear and descriptive title
-   Steps to reproduce the issue
-   Expected vs. actual behavior
-   Any error messages or stack traces
-   Your environment (OS, Node.js version, etc.)

> ⚠️ **Do NOT report security vulnerabilities publicly.**
> Please email us at **trackiteasymain@gmail.com** to disclose sensitive issues.

---

### 🚀 Suggesting Enhancements

We welcome feature requests and improvement ideas! Before suggesting:

1. Ensure your idea hasn’t already been suggested.
2. Think about whether it fits with the goals of the project.
3. Search for similar issues, and comment there if relevant.

If you’re opening a new suggestion:

-   Use a clear and descriptive title.
-   Describe the current behavior and what you’d like to see instead.
-   Explain why this change would benefit users.
-   Include examples, diagrams, or references to similar projects if possible.

---

### 🧩 Creating a New Module

Our project follows a clean, layered architecture:

-   `app/actions` – use cases (e.g. `FollowParcelAction.ts`)
-   `domain/services` – business logic
-   `infra/db/repositories` – implementation of persistence
-   `infra/db/repositories/interfaces` – repository interfaces
-   `api/routes` – Fastify routes and schemas

#### To add a new feature:

1. **Create an Action:**
   In `app/actions/feature/`, add a class like:

    ```ts
    export class MyAction {
        constructor(private deps: DomainContext) {}
        async execute(input: InputType): Promise<OutputType> {
            return await this.deps.myService.doSomething(input);
        }
    }
    ```

2. **Implement the Service:**
   In `domain/services/`, encapsulate your core logic:

    ```ts
    export class MyService {
        async doSomething(input: InputType): Promise<OutputType> {
            // business logic here
        }
    }
    ```

3. **Define the Repository Interface:**
   In infra/db/repositories/interfaces/, define a contract for data persistence:

    ```ts
    export interface MyRepository {
        findById(id: string): Promise<MyEntity | null>;
        save(entity: MyEntity): Promise<void>;
    }
    ```

4. **Implement the Repository:**
   In infra/db/repositories/, implement your repository using the chosen database layer (e.g. Drizzle):

    ```ts
    export class DrizzleMyRepository implements MyRepository {
        async findById(id: string): Promise<MyEntity | null> {
            // fetch from database
        }

        async save(entity: MyEntity): Promise<void> {
            // save to database
        }
    }
    ```

5. **Add a Route (Optional if Public-Facing):**
   In api/routes/feature/, define the Fastify route with schema validation:

    ```ts
    export const myRoute = {
        url: "/my-endpoint",
        method: "POST",
        schema: {
            tags: ["feature"],
            body: {
                type: "object",
                required: ["someField"],
                properties: {
                    someField: { type: "string" },
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        result: { type: "string" },
                    },
                },
            },
        },
        handler: async (req, reply) => {
            const action = new MyAction(req.server.domainContext);
            const result = await action.execute(req.body);
            return reply.code(200).send({ result });
        },
    };
    ```

## 🎨 Style Guide

====================

### 📁 Architecture

**Layer overview:**

-   `api/` — routes (endpoints) and request/response validation
-   `app/` — use cases (business logic, actions)
-   `domain/` — services, entities, domain logic
-   `infra/` — data access, repositories, integration with DB and external services
-   `types/` — global types, type extensions, declarations

### 🧾 Interfaces

**Principle:**

-   All interfaces are placed in the `interfaces/` folder (or in the relevant module).
-   Interface implementation is kept separately, in the appropriate layer (e.g., in `infra/` or `domain/`).

**Example interface structure:**

```
interfaces/
  └─ IUserRepository.ts
infra/
  └─ db/
      └─ repositories/
          └─ user.repo.ts (implements IUserRepository)
```

**IUserRepository.ts**

```ts
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    // ...other methods
}
```

### 📝 Commit Messages

Use conventional commits:

-   `feat`: add new functionality
-   `fix`: bug fix
-   `refactor`: code refactoring without changing functionality
-   `docs`: documentation changes
-   `test`: add/change tests
-   `chore`: technical changes (build, dependencies, CI)

**Examples:**

-   `feat: add API for key generation`
-   `fix: fix authorization bug`
-   `refactor: simplify tracking service logic`
-   `docs: update README for project setup`
-   `test: add tests for UserService`
-   `chore: update dependencies and linters`

## 👥 Join the Project Team

We’re always looking for passionate people to join our team! If you’re interested:

1. **Check the [open issues](https://github.com/TRITONKOR/Track-It-Easy-Backend/issues)** to find something that excites you.
2. **Comment on the issue** to express your interest and ask any questions.
3. **Submit a pull request** with your proposed changes.

Even if you’re not sure where to start, feel free to reach out — we can help you find a suitable task.

## 🙏 Attribution

This project follows the principles of **Clean Architecture** by Robert C. Martin. We also draw inspiration from other open-source projects and communities. Special thanks to all contributors and supporters of **Track It Easy**!
