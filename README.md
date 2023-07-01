
# Minesweeper

A classic Minesweeper game built using vanilla JavaScript and CSS, following the Object-Oriented Programming (OOP) paradigm. The application is bundled using Parcel.

[Check it out!](https://mine-sweeper-esheleyni.netlify.app/)

![Minesweeper Screenshot](./images/screen-shot.png)

## Features

- Interactive GUI that allows players to test their skills and strategy.
- Supports different difficulty levels.
- Offers hints and safe clicks to assist during gameplay.
- Enables manual placement of mines and a "seven boom" feature.
- Allows game state undo for previous moves.
- Features an interactive timer, flag counter, and live count.

## Installation

```bash
git clone https://github.com/EshelEyni/minesweeper.git
```

After cloning the repository, move into the project directory:

```bash
cd minesweeper
```

Install the necessary dependencies:

```bash
npm install
```

This project uses Parcel for bundling the application. You can start the development server using:

```bash
npm run start
```

And build the application for production with:

```bash
npm run build
```

The application should be running at `http://localhost:1234` if you're running the development server.

## Usage

Open the application in a web browser. You can select the difficulty level, place flags to mark potential mines, use hints or safe clicks, or undo previous moves. A timer keeps track of the game duration. The game ends when all non-mine cells are revealed, or a mine is clicked.
