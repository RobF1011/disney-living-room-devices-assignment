# Rob's Disney Coding Assignment

A Home Page similar to the current Disney+ experience.

It can be viewed on the web at (https://disney.robf.dev/)

- A fun loading screen is displayed while the initial data is being fetched
  - For demo purposes there is a 3 sec timeout to simulate a slower connection
- Use the arrow keys to navigate the page
- Press the 'Enter' key to select a tile
  - This will show a dialog/modal with some information on your selection.
  - The Backspace key or Enter key will close the modal.

Additional notes:
- The ref sets are loaded dynamically as you move down the page

## Local Setup (Using npm)
1. Clone the repo
2. Install all dependencies using `npm install` command.
3. Run a first time build - `npm run build`.
4. To start the dev server, run `npm run dev`.

The server will run at `http://localhost:8000/`. 
The page will reload after each file change. 
