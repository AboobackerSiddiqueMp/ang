import { Component, OnInit } from '@angular/core';
import { AddService } from 'src/app/service/add.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  drinkDetails: any = {
    item_id: '',
    session_id: '',
    time: "2024-05-14T11:53:08.161Z",
    count: 0,
    withORWithOut: 0
  };
  drinksname: any = '';

  selectedTime: any = '';
  buttonsDisabled: boolean = false;
  allButtonsDisabled: boolean = false;

  morningCounts: any[] = [];
  eveningCounts: any[] = [];
  currentdata: any = '';

  constructor(private addService: AddService) { }

  ngOnInit() {
    this.getAllDataFromServer();
    this.setSelectedTimeBasedOnCurrentTime();
    this.getAllorders();
  }

  setSelectedTimeBasedOnCurrentTime() {
    const currentHour = new Date().getHours();
    this.selectedTime = currentHour < 12 ? '1' : '2';
  }

  adddrinkorder(drink: any) {
    this.buttonsDisabled = true;
    this.allButtonsDisabled = true; // Disable all buttons

    this.drinkDetails.item_id = drink;
    this.drinkDetails.session_id = this.selectedTime;

    this.addService.addemp(this.drinkDetails).subscribe(
      response => {
        console.log('Drink order added successfully:', response);
        this.getAllDataFromServer(); // Call this method after successful add
        this.buttonsDisabled = false; // Re-enable buttons after adding order
        this.getAllorders()
      },
      error => {
        console.error('Error adding drink order:', error);
        this.buttonsDisabled = false; // Re-enable individual button if needed
        this.allButtonsDisabled = false; // Re-enable all buttons even if there is an error
      }
    );
  }

  getAllDataFromServer() {
    this.addService.getAllData().subscribe(
      data => {
        console.log('Data from server:', data);
        this.drinksname = data;
      },
      error => {
        console.error('Error fetching data from server:', error);
        // Handle error, show error message, etc.
      }
    );
  }

  getAllorders() {
    this.addService.getAllordrs().subscribe(
      data => {
        console.log('Order data from server:', data);
        this.processData(data);
        console.log(this.morningCounts)
        this.currentdata = this.selectedTime === '1' ? this.morningCounts : this.eveningCounts;
      },
      error => {
        console.error('Error fetching order from server:', error);
        // Handle error, show error message, etc.
      }
    );
  }

  processData(data: any[]) {
    this.morningCounts = [];
    this.eveningCounts = [];

    data?.forEach(entry => {
      const itemName = entry.itemName;
      const sessionName = entry.name;

      let countsArray = sessionName === 'morning' ? this.morningCounts : this.eveningCounts;
      const existingItem = countsArray.find(item => item.name === itemName);

      if (existingItem) {
        existingItem.count++;
      } else {
        countsArray.push({ name: itemName, count: 1 });
      }
    });
  }
}
