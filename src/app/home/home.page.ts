import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentPhase: number = 4; // Inicia llena
  isPumpActive: boolean = false;
  pumpInterval: any; // Para el temporizador
  pumpTimer: number = 0; // Tiempo que la bomba ha estado encendida (en segundos)

  constructor(private alertController: AlertController) {}

  async setPhase(phase: number) {
    this.currentPhase = phase;

    if (this.currentPhase === 4) {
      await this.showEmergencyAlert();
    }
  }

  togglePump() {
    if (this.isPumpActive) {
      this.stopPump();
    } else {
      this.startPump();
    }
  }

  startPump() {
    this.isPumpActive = true;
    this.pumpTimer = 0;

    // Intervalo para reducir fases y contar tiempo
    this.pumpInterval = setInterval(() => {
      this.pumpTimer++;
      if (this.currentPhase > 1) {
        this.currentPhase--; // Reducimos la fase
      } else {
        this.stopPump();
        this.showEmptyAlert();
      }
    }, 2000); // Cambia de fase cada 2 segundos
  }

  stopPump() {
    this.isPumpActive = false;
    clearInterval(this.pumpInterval);
  }

  async showEmergencyAlert() {
    const alert = await this.alertController.create({
      header: '¡Emergencia!',
      subHeader: 'Cisterna llena',
      message: 'La cisterna está completamente llena. Vacíe el agua antes de que se produzca una inundación.',
      buttons: ['Entendido']
    });

    await alert.present();
  }

  async showEmptyAlert() {
    const alert = await this.alertController.create({
      header: 'Cisterna vacía',
      message: 'La cisterna se ha vaciado. Por favor, detenga la bomba para evitar daños.',
      buttons: ['Ok']
    });

    await alert.present();
  }

  getWaterHeight(): string {
    return `${25 * this.currentPhase}%`; // Cada fase sube un 25%
  }
}