import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { isEqual, isDeep } from "lodash";

@Component({
  selector: "card-player-view",
  templateUrl: "./card-player.component.html",
  styleUrls: ["./card-player.component.css"],
})
export class CardPlayer implements OnInit {
  cardForm: FormGroup;
  numbersGenerated = false;
  randomCardNums: number[] = [];
  showCardMap = [];
  clickedValues = [];
  gameStarted: boolean = false;
  playBtnText: string = "Play!";

  private readonly cardNumbers = [4, 8, 12];
  private readonly backendService = "http://localhost:3000/card/numbers";

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      "card-selector": ["", [Validators.required]],
    });
  }

  async onSelectionChanged(): Promise<void> {
    const selection = this.cardForm.get("card-selector").value;
    this.resetValues();

    const url = `${this.backendService}?count=${selection}`;
    try {
      const randomNumbersArr: any = await this.http
        .get(url, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .toPromise();
      this.numbersGenerated = true;
      this.randomCardNums = randomNumbersArr;
      this.showCardMap = this.randomCardNums.map((num) => true);
    } catch (err) {
      this.resetValues();
      alert(err.details.message);
    }
  }

  handleCardClick(event) {
    if (!this.gameStarted) {
      return;
    }
    const indexStr = event.target.attributes["data-index"]["value"];
    const index = parseInt(indexStr, 10);
    const val = parseInt(event.target.value, 10);
    if (!this.showCardMap[index]) {
      this.showCardMap[index] = true;
      this.clickedValues.push(val);
    }
    this.computeResult();
  }

  computeResult() {
    const remainingCard = this.showCardMap.some((value) => value === false);
    if (!remainingCard) {
      this.randomCardNums.sort();
      console.log(this.randomCardNums);
      console.log(this.clickedValues);
      if (isEqual(this.randomCardNums, this.clickedValues)) {
        alert("You Won!");
      } else {
        alert("Try again!");
      }
      this.resetValues();
    }
  }

  handlePlay(event) {
    if (this.gameStarted) {
      this.resetValues();
    } else {
      this.showCardMap.forEach((item, index) => {
        this.showCardMap[index] = false;
      });
      this.gameStarted = true;
      this.playBtnText = "Reset!";
    }
  }

  resetValues() {
    this.randomCardNums.length = 0;
    this.showCardMap.length = 0;
    this.playBtnText = "Play!";
    this.gameStarted = false;
    this.numbersGenerated = false;
    this.clickedValues = [];
  }
}
