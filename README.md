# EECS 581 Team Portfolio

**Course:** EECS 581 - Software Engineering II  
**Semester:** Fall 2026  
**Instructor:** Professor Hossein Saiedian

## Team Members

### Anh Hoang

<img src="assets/anhhoang.jpg" alt="Anh Hoang" width="150">

- **KU Email:** [anh.hoang@ku.edu](mailto:anh.hoang@ku.edu)
- **GitHub:** [byAnh-Dev](https://github.com/byAnh-dev)
- **Expertise:** React, Flask, Node.js
- **Availability:** MWF 12:00PM - 1:00PM

### Sreeja Narahari

<img src="assets/team-member-2.jpg" alt="Team Member 2" width="150">

- **KU Email:** [sreeja@ku.edu](mailto:sreeja@ku.edu)
- **GitHub:** [sreeja-na](https://github.com/sreeja-na)
- **Expertise:**
- **Availability:**

### Shayaan Mohammed

<img src="assets/Shayaan.JPG" alt="Team Member 3" width="150">

- **KU Email:** [shayaanm@ku.edu](mailto:shayaanm@ku.edu)
- **GitHub:** [Shayaan04](https://github.com/Shayaan04)
- **Expertise:**
- **Availability:**

### Kodai Nakae

<img src="assets/Kodai.PNG" alt="Team Member 4" width="150">

- **KU Email:** [kodai.nakae@ku.edu](mailto:kodai.nakae@ku.edu)
- **GitHub:** [kodai1126](https://github.com/kodai1126)
- **Expertise:**
- **Availability:**

### Mariska Rai

<img src="assets/Mariska.png" alt="Team Member 4" width="150">

- **KU Email:** [mrai38@ku.edu](mailto:mrai38@ku.edu)
- **GitHub:** [mariskarai](https://github.com/mariskarai)
- **Expertise:** UI/UX, BACK END
- **Availability:** Wednesday, 1-2pm

### Rijul Poudel

<img src="assets/rijul.png" alt="Team Member 4" width="150">

- **KU Email:** [rijulpoudel72@ku.edu](mailto:rijulpoudel72@ku.edu)
- **GitHub:** [rijulpoudel](https://github.com/rijulpoudel)
- **Expertise:** Backend development
- **Availability:**Wednesday-Friday (5:00PM - 8:00PM)

### Montaha Jornaz

<img src="assets/team-member-4.jpg" alt="Team Member 4" width="150">

- **KU Email:** [m890j038@ku.edu](mailto:m890j038@ku.edu)
- **GitHub:** [montahajornaz](https://github.com/montahajornaz)
- **Expertise:** [Backend]
- **Availability:** MWF 1:00pm - 2:00pm

## Team Roles

| Role                 | Team member   | Responsibilities                                           |
| -------------------- | ------------- | ---------------------------------------------------------- |
| Team administrator   | Montaha       | Submit project links and deliverables to Canvas            |
| Project coordinator  | Mariska       | Track milestones, tasks, and deadlines                     |
| Repository manager   | Anh, Rijul    | Maintain the repository structure and review pull requests |
| Meeting-log owner    | Shayaan       | Record attendance, decisions, tasks, and task completion   |
| Testing/quality lead | Kodai, Sreeja | Coordinate testing and verify deliverables                 |

## Meetings

- **Internal team meeting: Wed 8:00PM-9:00PM**
- **Weekly TA meeting:** Wed 1:00pm - 2:00pm, Eaton 3001
- [View all meeting logs](./meeting-logs/)

## Minesweeper setup info

### How to run our repo

```sh
git clone https://github.com/byAnh-dev/EECS581-Project1-Minesweeper.git
cd EECS581-Project1-Minesweeper
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. **Ctrl+C** in that terminal to stop the server.

### Dependencies and source layout

| Packages                                         | Purpose                                                     |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `react`, `react-dom`                             | UI rendering                                                |
| `typescript`, `@types/react`, `@types/react-dom` | Type checking and React type definitions                    |
| `vite`, `@vitejs/plugin-react`                   | Development server, React integration, and production build |

```text
src/
  boardManager.ts     # Board operations (placeholder)
  gameLogic.ts        # Start, uncover, and flag contracts
  inputHandler.ts     # Input validation (placeholder)
  UserInterface.tsx   # React interface
  types.ts           # Shared game types
  main.tsx           # React entry point
  styles.css         # Styles
```
