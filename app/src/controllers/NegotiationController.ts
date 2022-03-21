import { Negotiation } from "../models/Negotiation.js";
import { Negotiations } from "../models/Negotiations.js";
import { NegotiationsView } from "../views/Negotiations-view.js";
import { MessageView } from "../views/Message-view.js";
import { ExecutionTimeLogger } from "../decorators/execution-time-logger.js";
import { Detective } from "../decorators/detective.js";
import { DomInjector } from "../decorators/dom-injector.js";
import { DailyNegotiations } from "../interfaces/daily-negotiations.js";

export class NegotiationController {
    @DomInjector("#date")
    private inputDate: HTMLInputElement;

    @DomInjector("#quantity")
    private inputQuantity: HTMLInputElement;

    @DomInjector("#value")
    private inputValue: HTMLInputElement;

    private negotiations = new Negotiations;
    private negotiationsView = new NegotiationsView("#negotiations");
    private messageView = new MessageView("#mensagemView");

    constructor() {
        this.negotiationsView.update(this.negotiations);
    }

    @ExecutionTimeLogger()
    @Detective
    add(): void {
        try {
            this.negotiations.add(
                this.createNegotiation()
            );
            this.resetForm();
            this.updateViews();
        } catch (error) {
            this.messageView.update(error, "error");
        }
    }

    async importData(): Promise<void> {
        console.log("Import data");

        const res: DailyNegotiations[] = await fetch("http://localhost:8080/dados").then(res => res.json());

        res.map(item => {
            this.negotiations.add(
                new Negotiation(
                    new Date(),
                    item.vezes,
                    item.montante
                )
            )
        });

        this.updateViews();
    }

    private resetForm(): void {
        this.inputDate.value = "";
        this.inputQuantity.value = "1";
        this.inputValue.value = "0.0";
        this.inputDate.focus();
    }

    private createNegotiation(): Negotiation {
        return Negotiation.createFrom(
            this.inputDate.value,
            this.inputQuantity.value,
            this.inputValue.value
        );
    }

    private updateViews(): void {
        this.negotiationsView.update(this.negotiations);
        this.messageView.update("Negotiation successfully created!");
    }
}