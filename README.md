# Blackjack WebAssembly Integration

## Compiling C++ to WebAssembly

To compile `blackjack_wasm.cpp` to WebAssembly, you need to have [Emscripten](https://emscripten.org/) installed and configured.

Use the following command to compile:

```bash
emcc blackjack_wasm.cpp -o blackjack.js -s EXPORTED_FUNCTIONS="['_startGame', '_getPlayerHandSize', '_getDealerHandSize', '_getPlayerCard', '_getDealerCard', '_getPlayerScore', '_getDealerScore', '_isGameOver', '_isPlayerTurn', '_playerHit', '_playerStand', '_getResult']" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" -s MODULARIZE=1 -s EXPORT_NAME="createBlackjackModule" -O3
```

This will generate `blackjack.js` and `blackjack.wasm`.

## Using the WebAssembly Module in JavaScript

In your `script.js`, you can load the module like this:

```js
let blackjackModule;

createBlackjackModule().then(Module => {
    blackjackModule = Module;
    blackjackModule._startGame();
    // Now you can call other exported functions using:
    // blackjackModule._playerHit(), blackjackModule._getPlayerScore(), etc.
});
```

Use `ccall` or `cwrap` to call functions with arguments and return values.

## Next Steps

- Replace the existing JavaScript game logic with calls to the WebAssembly module.
- Update the UI based on the game state from WebAssembly.
