// import React, { useEffect } from "react";

// export default function PaymentForm({ amount, preferenceId, payer }) {
//   useEffect(() => {
//     const mp = new window.MercadoPago('TEST-d9688230-b4e5-44fc-b5f4-3dcdaa1fbbe2', {
//       locale: 'pt'
//     });
//     const bricksBuilder = mp.bricks();
    
//     const renderPaymentBrick = async (bricksBuilder) => {
//       // Limpar o container antes de criar um novo brick
//       const container = document.getElementById('paymentBrick_container');
//       if (container) {
//         container.innerHTML = '';
//       }
      
//       // Destruir o controller anterior se existir
//       if (window.paymentBrickController) {
//         try {
//           window.paymentBrickController.destroy();
//         } catch (error) {
//           console.log('Erro ao destruir brick anterior:', error);
//         }
//       }
      
//       const settings = {
//         initialization: {
//           /*
//             "amount" é a quantia total a pagar por todos os meios de pagamento com exceção da Conta Mercado Pago e Parcelas sem cartão de crédito, que têm seus valores de processamento determinados no backend através do "preferenceId"
//           */
//           amount: amount || 10000,
//           preferenceId: preferenceId || "<PREFERENCE_ID>",
//           payer: {
//             firstName: payer?.firstName || "",
//             lastName: payer?.lastName || "",
//             email: payer?.email || "",
//           },
//         },
//         customization: {
//           visual: {
//             style: {
//               theme: "default",
//             },
//           },
//           paymentMethods: {
//             creditCard: "all",
//             debitCard: "all",
//             ticket: "all",
//             bankTransfer: "all",
//             mercadoPago: "all",
//             maxInstallments: 5
//           },
//         },
//         callbacks: {
//           onReady: () => {
//             /*
//              Callback chamado quando o Brick está pronto.
//              Aqui, você pode ocultar seu site, por exemplo.
//             */
//           },
//           onSubmit: ({ selectedPaymentMethod, formData }) => {
//             // callback chamado quando há click no botão de envio de dados
//             return new Promise((resolve, reject) => {
//               fetch("/process_payment", {
//                 selectedPaymentMethod,
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(formData),
//               })
//                 .then((response) => response.json())
//                 .then((response) => {
//                   // receber o resultado do pagamento
//                   resolve();
//                 })
//                 .catch((error) => {
//                   // manejar a resposta de erro ao tentar criar um pagamento
//                   reject();
//                 });
//             });
//           },
//           onError: (error) => {
//             // callback chamado para todos os casos de erro do Brick
//             console.error(error);
//           },
//         },
//       };
//       window.paymentBrickController = await bricksBuilder.create(
//         "payment",
//         "paymentBrick_container",
//         settings
//       );
//     };
    
//     renderPaymentBrick(bricksBuilder);
    
//     // Função de cleanup para quando o componente for desmontado
//     return () => {
//       if (window.paymentBrickController) {
//         try {
//           window.paymentBrickController.destroy();
//           window.paymentBrickController = null;
//         } catch (error) {
//           console.log('Erro ao destruir payment brick:', error);
//         }
//       }
//     };
//   }, [amount, preferenceId, payer]);

//   return (
//     <div>
//       <h2>Escolha seu Método de Pagamento</h2>
//       <div id="paymentBrick_container"></div>
//     </div>
//   );
// }
