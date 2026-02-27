# 📚 GitHub Actions Workflows Documentation

> A comprehensive guide to all GitHub Actions workflows in this repository

---

## 📋 Table of Contents

1. [01 - Building Blocks](#01---building-blocks)
2. [Calculator](#calculator)
3. [02 - Workflow Events](#02---workflow-events)
4. [GitHub Runner](#github-runner)
5. [04 - Using Actions](#04---using-actions)
6. [05-1 - Event Filters and Activity Types](#05-1---event-filters-and-activity-types)
7. [05-2 - Event Filters and Activity Types](#05-2---event-filters-and-activity-types)
8. [06 - Contexts](#06---contexts)
9. [07 - Expressions](#07---expressions)
10. [08 - Using Variables](#08---using-variables)

---

## 🏗️ 01 - Building Blocks

**File:** `.github/workflows/01-building-blocks.yml`

### 🎯 Purpose
Demonstrates the fundamental structure of GitHub Actions workflows with basic job and step configurations.

### 🔄 Trigger
- ✅ Push events to any branch

### 📦 Jobs

#### 1️⃣ **echo-hello**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - Prints "hello world" to the console
  - Demonstrates a simple single-step job

#### 2️⃣ **echo-goodbye**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - Contains two steps running sequentially
  - First step: Prints "i will fail" but exits with success (exit 0)
  - Second step: Prints "good bye"
  - Shows that steps run in order within a job

### 💡 Key Learning Points
- ✨ Basic workflow syntax structure
- ✨ How to define multiple jobs
- ✨ Jobs run in parallel by default
- ✨ Steps within a job run sequentially
- ✨ Using the `run` command to execute shell commands

---

## 🧮 Calculator

**File:** `.github/workflows/calculator.yml`

### 🎯 Purpose
A comprehensive workflow demonstrating advanced concepts like workflow inputs, job outputs, environment variables, and complex conditional logic.

### 🔄 Triggers
- ✅ Push events
- ✅ Manual workflow dispatch with custom inputs

### 📥 Workflow Inputs
- **A:** Number (default: 4)
- **B:** Number (default: 5)
- **Operation:** Choice (Add/Subtract/Multiply/Divide)
- **Light:** Traffic light color choice (Red/Yellow/Green/BlinkingYellow/BlinkingRed)
- **TimeOfDay:** Choice (Day/Night)

### 📦 Jobs

#### 1️⃣ **defineValues**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - **Step 1: Define A and B**
    - Creates environment variables A=2, B=0
    - Uses `GITHUB_ENV` to make variables available to subsequent steps
  - **Step 2: Define C and D**
    - Creates step outputs C=4, D=2
    - Uses `GITHUB_OUTPUT` to export values
  - **Step 3: Calculate sum and division**
    - Computes sum of A+B+C+D
    - Calculates C/D
    - Demonstrates accessing step outputs within same job
- 📤 **Outputs:**
  - `C`: Value of C (4)
  - `D`: Value of D (2)

#### 2️⃣ **UseJOB1Values**
- 🖥️ **Runner:** `ubuntu-latest`
- 🔗 **Depends on:** `defineValues`
- 📝 **What it does:**
  - Demonstrates how to use outputs from a previous job
  - Uses `needs.defineValues.outputs.C` and `needs.defineValues.outputs.D`
  - Calculates division using values from Job 1

#### 3️⃣ **Compute**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - **Step 1: Compute**
    - Performs calculator operations based on user input
    - Uses bash case statements for operation selection
    - Includes error handling for division by zero
    - Uses `bc` calculator for arithmetic
    - Exports expression and result as step outputs
  - **Step 2: Print Result**
    - Displays the mathematical expression and result
  - **Step 3: Traffic Signals** 🚦
    - Complex conditional logic simulating traffic light behavior
    - Determines Action, Severity, and Note based on light color
    - Adjusts severity based on time of day (Night increases risk)
    - Exports values to environment for next step
  - **Step 4: Instruction To Driver**
    - Reads the environment variables from previous step
    - Displays safety instructions to driver

### 💡 Key Learning Points
- ✨ Workflow dispatch with custom inputs
- ✨ Using `GITHUB_ENV` for environment variables (available to subsequent steps in same job)
- ✨ Using `GITHUB_OUTPUT` for step outputs (available to subsequent steps in same job)
- ✨ Job outputs (available to other jobs via `needs`)
- ✨ Job dependencies with `needs`
- ✨ Complex bash scripting with case statements
- ✨ Error handling and validation
- ✨ Nested conditional logic (if/elif/else)
- ✨ Using `bc` for arithmetic calculations

---

## 🎪 02 - Workflow Events

**File:** `.github/workflows/02-workflow-events.yaml`

### 🎯 Purpose
Demonstrates different types of workflow triggers and how to share data between jobs using outputs.

### 🔄 Triggers
- ✅ Push events
- ✅ Pull request events
- ✅ Manual workflow dispatch
- ✅ Scheduled runs (Cron: `5 2 * 11 5` - At 2:05 AM on Friday in November)

### 📦 Jobs

#### 1️⃣ **echo**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - **Step 1: Show the trigger**
    - Displays which event triggered the workflow (`github.event_name`)
  - **Step 2: Say hi**
    - Simple greeting message
  - **Step 3: Calculate sum and export for next steps**
    - Calculates 1+2
    - Exports SUM to `GITHUB_ENV` (available to subsequent steps)
  - **Step 4: Use SUM in next step**
    - Demonstrates using the environment variable from previous step
  - **Step 5: Use GitHub Output**
    - Creates step output `value=2`
  - **Step 6: Use SUM + step output**
    - Combines environment variable and step output
    - Creates new step output `sumWithValue`
- 📤 **Outputs:**
  - `value`: Step output value (2)
  - `sumWithValue`: Combined calculation result (5)

#### 2️⃣ **echo2**
- 🖥️ **Runner:** `ubuntu-latest`
- 🔗 **Depends on:** `echo`
- 📝 **What it does:**
  - Demonstrates accessing outputs from previous job
  - Uses `needs.echo.outputs.value`
  - Uses `needs.echo.outputs.sumWithValue`

### 💡 Key Learning Points
- ✨ Multiple trigger types in one workflow
- ✨ Cron schedule syntax for automated runs
- ✨ `github.event_name` context to identify trigger
- ✨ Difference between `GITHUB_ENV` (step-to-step) and `GITHUB_OUTPUT` (exportable)
- ✨ Declaring job outputs at job level
- ✨ Accessing previous job outputs with `needs.<job>.<outputs>.<output_name>`

---

## 🖥️ GitHub Runner

**File:** `.github/workflows/03-GitHub_Runners.yaml`

### 🎯 Purpose
Demonstrates how to run jobs on different operating system runners.

### 🔄 Trigger
- ✅ Push events

### 📦 Jobs

#### 1️⃣ **UbuntuEcho**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - Displays that it's running on Ubuntu
  - Shows the `RUNNER_OS` environment variable (Linux)

#### 2️⃣ **EchoOnWindows**
- 🖥️ **Runner:** `windows-latest`
- 🐚 **Shell:** bash (explicitly set)
- 📝 **What it does:**
  - Displays that it's running on Windows
  - Shows the `RUNNER_OS` environment variable (Windows)
  - Uses bash shell on Windows runner

### 💡 Key Learning Points
- ✨ Different runner operating systems (ubuntu-latest, windows-latest)
- ✨ Jobs run independently on separate runners
- ✨ Using `RUNNER_OS` environment variable
- ✨ Specifying shell type on Windows runner
- ✨ Cross-platform workflow execution

---

## ⚛️ 04 - Using Actions

**File:** `.github/workflows/04-Using-Actions.yaml`

### 🎯 Purpose
Demonstrates how to use pre-built GitHub Actions from the marketplace to build and test a React application.

### 🔄 Trigger
- ✅ Push events

### 📦 Jobs

#### 1️⃣ **build**
- 🖥️ **Runner:** `ubuntu-latest`
- 📁 **Working Directory:** `04-Using-Actions/react-app`
- 📝 **What it does:**
  - **Step 1: Checkout Code** 🔽
    - Uses `actions/checkout@v4`
    - Clones the repository to the runner
  - **Step 2: Setup Node** 🟢
    - Uses `actions/setup-node@v4`
    - Installs Node.js version 20.x
  - **Step 3: Install Dependencies** 📦
    - Runs `npm ci` (clean install from package-lock.json)
    - Installs all project dependencies
  - **Step 4: Run Unit Test** ✅
    - Runs `npm run test`
    - Executes test suite

### 💡 Key Learning Points
- ✨ Using pre-built actions with `uses` keyword
- ✨ Action versioning (@v4)
- ✨ Passing parameters to actions with `with`
- ✨ Setting default working directory for all steps
- ✨ Checking out code is required to access repository files
- ✨ Setting up runtime environments (Node.js)
- ✨ Running npm commands
- ✨ CI/CD pipeline basics: checkout → setup → install → test

---

## 🔍 05-1 - Event Filters and Activity Types

**File:** `.github/workflows/05-1-filters-activity-types.yaml`

### 🎯 Purpose
Demonstrates how to filter workflow triggers based on pull request activity types and target branches.

### 🔄 Trigger
- ✅ Pull request events with specific conditions:
  - **Activity Types:** `opened`, `synchronize`
  - **Target Branch:** `main`

### 📦 Jobs

#### 1️⃣ **echo**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - Runs only when a PR is opened or synchronized (new commits pushed)
  - Only triggers if the base branch is `main`
  - Prints confirmation message

### 💡 Key Learning Points
- ✨ Filtering pull request events by activity type
- ✨ `opened`: When PR is first created
- ✨ `synchronize`: When new commits are pushed to PR
- ✨ Branch filtering with `branches` key
- ✨ Combining multiple filters (types + branches)

---

## 🔍 05-2 - Event Filters and Activity Types

**File:** `.github/workflows/05-2 - filters-activity-types.yaml`

### 🎯 Purpose
Demonstrates filtering for pull request closure events targeting specific branches.

### 🔄 Trigger
- ✅ Pull request events with specific conditions:
  - **Activity Type:** `closed`
  - **Target Branch:** `main`

### 📦 Jobs

#### 1️⃣ **echo**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - Runs only when a PR targeting `main` is closed
  - Useful for cleanup or notification tasks
  - Prints confirmation message

### 💡 Key Learning Points
- ✨ `closed` activity type (PR closed or merged)
- ✨ Separating workflows for different PR stages
- ✨ Multiple workflows can respond to same base event with different filters

---

## 🎯 06 - Contexts

**File:** `.github/workflows/06-Contexts.yaml`

### 🎯 Purpose
Demonstrates GitHub Actions contexts and environment variable precedence/scoping.

### 🔄 Triggers
- ✅ Push events
- ✅ Manual workflow dispatch with debug input

### 🏷️ Run Name
- Dynamic: `06-Contexts | DEBUG -${{inputs.debug}}`

### 📥 Workflow Inputs
- **debug:** Boolean (default: false)

### 🌍 Workflow-Level Environment Variables
- `MY_AatWorkflow: 1`
- `MY_BatWorkflow: 2`
- `MY_OverWritten: 'workflow'`

### 📦 Jobs

#### 1️⃣ **echo-data**
- 🖥️ **Runner:** `ubuntu-latest`
- 🌍 **Job-Level Environment Variables:**
  - `MY_AatJob: 3`
  - `MY_BatJob: 4`
  - `MY_OverWritten: 'job'` (overrides workflow level)
- 📝 **What it does:**
  - **Step 1: Display Information** ℹ️
    - Shows various GitHub contexts:
      - `github.event_name`: How workflow was triggered
      - `github.ref`: Branch or tag reference
      - `github.actor`: User who triggered workflow
      - `github.workflow`: Workflow name
      - `github.run_id`: Unique run identifier
      - `github.run_number`: Sequential run number
  - **Step 2: Retrieve Variable** 📊
    - Accesses repository variable `vars.MY_VAR`
    - Demonstrates repository-level variables
  - **Step 3: Retrieve Environment Variables** 🔢
    - Sets step-level `MY_OverWritten: 'step'`
    - Shows precedence: step > job > workflow
    - Performs arithmetic with env variables from different levels
  - **Step 4: Priority of ENV's** 🏆
    - Demonstrates which value is used when variable is defined at multiple levels
    - Shows step level has highest priority

### 💡 Key Learning Points
- ✨ GitHub context objects (`github`, `vars`, `env`, `runner`)
- ✨ Accessing workflow metadata
- ✨ Environment variable scoping (workflow/job/step levels)
- ✨ Variable precedence: Step > Job > Workflow
- ✨ Repository variables with `vars` context
- ✨ Dynamic run names with expressions
- ✨ Using expressions in environment variable values

---

## 🔀 07 - Expressions

**File:** `.github/workflows/07-expressions.yaml`

### 🎯 Purpose
Demonstrates conditional logic, expressions, and default values in GitHub Actions.

### 🔄 Trigger
- ✅ Manual workflow dispatch with debug input

### 🏷️ Run Name
- Dynamic: `07-Expressions | DEBUG - ${{inputs.debug && 'ON' || 'OFF' }}`
- Uses ternary-like logic with `&&` and `||` operators

### 📥 Workflow Inputs
- **debug:** Boolean (default: false)

### 🌍 Workflow-Level Environment Variables
- `MY_VAR_WITH_DEFAULTS: ${{ vars.MY_VAR || 'default_value' }}`
  - Uses fallback value if repository variable doesn't exist

### 📦 Jobs

#### 1️⃣ **echo**
- 🖥️ **Runner:** `ubuntu-latest`
- 📝 **What it does:**
  - **Step 1: [debug] print start-up data** 🐛
    - `if: ${{inputs.debug}}`
    - Only runs when debug is true
    - Prints workflow metadata (event name, branch, commit SHA, runner OS)
  - **Step 2: [debug] Print when triggered from main** 🌿
    - `if: ${{inputs.debug && github.ref=='refs/heads/main'}}`
    - Only runs when debug is true AND branch is main
    - Shows compound conditional logic
  - **Step 3: Greeting** 👋
    - Always runs
    - Thanks user for running workflow

### 💡 Key Learning Points
- ✨ Conditional step execution with `if`
- ✨ Boolean expressions with `inputs.debug`
- ✨ Logical AND (`&&`) operator for multiple conditions
- ✨ Logical OR (`||`) operator for default values
- ✨ Ternary-like expressions: `condition && 'true_value' || 'false_value'`
- ✨ String comparison with `==`
- ✨ Dynamic run names based on input values
- ✨ Using fallback values for undefined variables

---

## 📊 08 - Using Variables

**File:** `.github/workflows/08-variables.yaml`

### 🎯 Purpose
Comprehensive demonstration of environment variable scoping, precedence, and access methods in GitHub Actions.

### 🔄 Triggers
- ✅ Push events
- ✅ Manual workflow dispatch

### 🌍 Workflow-Level Environment Variables
- `WORKFLOW_VAR: 'I am a workflow env var'`
- `OVERWRITTEN: 'I will be overwritten'`

### 📦 Jobs

#### 1️⃣ **echo**
- 🖥️ **Runner:** `ubuntu-24.04`
- 🌍 **Job-Level Environment Variables:**
  - `JOB_VAR: 'I am a job env var'`
  - `OVERWRITTEN: 'I have been overwritten at the job level'`
- 📝 **What it does:**
  - **Step 1: Print Env Variables (Step-level and precedence)** 📋
    - Defines step-level variables:
      - `STEP_VAR: 'I am a step env var'`
      - `step_var2: 'I am another step var'`
    - Shows **two ways to access variables:**
      - **Shell syntax:** `$VARIABLE_NAME`
      - **Expression syntax:** `${{ env.VARIABLE_NAME }}`
    - Demonstrates access to variables from all three levels:
      - Step-level variables
      - Job-level variables
      - Workflow-level variables
    - Shows overwrite chain: workflow → job → step
  - **Step 2: Overwrite at the step level** ♻️
    - Overrides `OVERWRITTEN` again at step level
    - `OVERWRITTEN: 'I have been overwritten at the step level'`
    - Confirms step-level has highest precedence

### 💡 Key Learning Points
- ✨ Three levels of environment variable scope:
  - 🌐 **Workflow level:** Available to all jobs and steps
  - 💼 **Job level:** Available to all steps in that job
  - 👣 **Step level:** Available only within that step
- ✨ Variable precedence order (highest to lowest):
  1. Step level
  2. Job level
  3. Workflow level
- ✨ Two ways to access variables:
  - Shell syntax: `$VAR` (uses shell's environment)
  - Expression syntax: `${{ env.VAR }}` (evaluated by GitHub Actions)
- ✨ Variable names are case-sensitive
- ✨ Lower scope levels override higher scope levels
- ✨ Each override only affects that scope and below

---

## 📈 Summary Matrix

| Workflow | Main Concept | Key Features | Runner(s) |
|----------|-------------|--------------|-----------|
| 01 - Building Blocks | Basic Structure | Jobs, Steps, Run commands | Ubuntu |
| Calculator | Advanced Logic | Inputs, Outputs, Conditionals, Math | Ubuntu |
| 02 - Workflow Events | Triggers & Sharing Data | Multiple triggers, Job outputs, Cron | Ubuntu |
| GitHub Runner | Multi-OS Execution | Ubuntu & Windows runners | Ubuntu, Windows |
| 04 - Using Actions | Marketplace Actions | Checkout, Setup Node, CI/CD | Ubuntu |
| 05-1 - Event Filters | PR Filtering | Activity types, Branch filters | Ubuntu |
| 05-2 - Event Filters | PR Closure | Closed events | Ubuntu |
| 06 - Contexts | GitHub Contexts | Metadata, Variable scoping | Ubuntu |
| 07 - Expressions | Conditional Logic | If conditions, Logical operators | Ubuntu |
| 08 - Using Variables | Variable Management | Scope levels, Precedence rules | Ubuntu |

---

## 🎓 Learning Path Recommendation

For beginners learning GitHub Actions, study the workflows in this order:

1. **01 - Building Blocks** - Start here to understand basic syntax
2. **03 - GitHub Runner** - Learn about different execution environments
3. **04 - Using Actions** - Discover pre-built actions
4. **02 - Workflow Events** - Understand triggers and data sharing
5. **05-1 & 05-2 - Event Filters** - Master event filtering
6. **08 - Using Variables** - Learn variable scoping
7. **06 - Contexts** - Explore GitHub contexts
8. **07 - Expressions** - Practice conditional logic
9. **Calculator** - Apply everything in a complex workflow

---

## 📚 Additional Resources

- 📖 [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 🔧 [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- 💡 [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- 🎯 [Context and Expression Syntax](https://docs.github.com/en/actions/learn-github-actions/contexts)

---

**Generated:** 2026-02-27
**Repository:** GitHub-Actions Learning Repository
**Total Workflows:** 10
