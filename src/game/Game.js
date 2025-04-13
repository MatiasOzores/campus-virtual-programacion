import Phaser from "phaser";
import mapaImg from "../assets/map.jpg"; // Usa una imagen de mapa

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("mapa", mapaImg);
    this.load.image("player", "https://i.imgur.com/6zjlGVP.png"); // Un icono temporal
  }

  create() {
    this.add.image(400, 300, "mapa"); // Cargar el mapa
    this.player = this.physics.add.sprite(100, 100, "player").setScale(0.1); // Crear jugador

    // Habilitar movimiento con teclado
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Movimiento del jugador
    if (this.cursors.left.isDown) {
      this.player.x -= 2;
    } else if (this.cursors.right.isDown) {
      this.player.x += 2;
    }

    if (this.cursors.up.isDown) {
      this.player.y -= 2;
    } else if (this.cursors.down.isDown) {
      this.player.y += 2;
    }
  }
}

export default GameScene;
