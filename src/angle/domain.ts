export type Angle =
    | "Time_Saving"
    | "Money_Saving"
    | "Growth"
    | "Risk_Reduction";

    export interface Idea {
        id: string;
        title: string;
        description: string;
        angle: Angle;
    }


export function generateIdeas (angle: Angle): Idea[] {
    switch(angle) {
        case "Time_Saving":
            return [
                {
                    id: "ts-1",
                    title: "Template pentru task-uri recurente.",
                    description: "Standardizeaza task-urile repetitive in template.",
                    angle: "Time_Saving",
                },
                {
                    id: "ts-2",
                    title: "Dasboard zilnic cu 3 prioritati.",
                    description: "Un ecran simplu care scoate in fata doar cele mai importante 3 lucruri.",
                    angle: "Time_Saving"
                },
            ];

        case "Money_Saving":
            return [
                {
                    id: "ms-1",
                    title: "Alerta de costuri neobisnuite.",
                    description: "Semnaleaza automat cand o cheltuiala iese din tiparul normal.",
                    angle: "Money_Saving",
                },

                {
                    id: "ms-2",
                    title: "Comparator simplu de furnizori.",
                    description: "Listeaza rapid alternative mai ieftine pentru acelasi tip de serviciu.",
                    angle: "Money_Saving",
                },
            ];
        
        case "Growth":
            return [
                {
                    id: "gr-1",
                    title: "Sugestii de upsell pentru clienti existenti.",
                    description: "Gaseste idei de extra-servicii pentru clienti.",
                    angle: "Growth",
                },

                {
                    id: "gr-2",
                    title: "Idei de canale noi de achizitie.",
                    description: "Propune canale de marketing care nu sunt inca folosite.",
                    angle: "Growth",

                },
            ];

        case "Risk_Reduction":
            return [
                {
                    id: "rr-1",
                    title: "Checklist de verificare inainte de livrare.",
                    description: "Reduce riscul de greseli dintr-un checklist standard.",
                    angle: "Risk_Reduction",
                },

                {
                    id: "rr-2",
                    title: "Alerta de dependente critice.",
                    description: "Avertizeaza cand un proces depinde de o singura persoana sau un singur tool.",
                    angle: "Risk_Reduction",
                },
            ]; 
    }
}