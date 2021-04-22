import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { isEqual } from "lodash";

@Component({
  selector: "card-player-view",
  templateUrl: "./card-player.component.html",
  styleUrls: ["./card-player.component.css"],
})
export class CardPlayer implements OnInit {
  cardForm: FormGroup;
  numbersGenerated = false;
  selectionChanged = false;
  randomCardNums: number[] = [];
  showCardMap = [];
  clickedValues = [];
  private readonly cardNumbers = [4, 8, 12];
  private readonly backendService = "http://localhost:3000/card/numbers";

  // @ViewChild('mydiv', { static: false }) public mydiv: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      "card-selector": ["", [Validators.required]],
    });
  }

  async onSelectionChanged(): Promise<void> {
    const selection = this.cardForm.get("card-selector").value;
    if (!selection) {
      return;
    }
    this.resetValues();

    this.selectionChanged = true;
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
      this.numbersGenerated = false;
      alert(err.details.message);
    }
  }

  handleCardClick(event) {
    const indexStr = event.target.attributes["data-index"]["value"];
    const index = parseInt(indexStr, 10);
    const val = event.target.value;
    if (!this.showCardMap[index]) {
      this.showCardMap[index] = true;
      this.clickedValues.push(val);
    }
    this.computeResult();
  }

  computeResult() {
    console.log(this.showCardMap);
    const remainingCard = this.showCardMap.some((value) => value === false);
    console.log(remainingCard);
    if (!remainingCard) {
      this.randomCardNums.sort();
      if (isEqual(this.randomCardNums, this.clickedValues)) {
        alert("You Won!");
      } else {
        alert("Try again!");
      }
      this.resetValues();
    }
  }

  handlePlay(event) {
    this.showCardMap.forEach((item, index) => {
      this.showCardMap[index] = false;
    });
    event.target.disabled = true;
  }

  resetValues() {
    this.showCardMap = [];
    this.numbersGenerated = false;
    this.randomCardNums = [];
    this.clickedValues = [];
    this.selectionChanged = false;
  }
}
