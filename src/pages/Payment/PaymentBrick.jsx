// import React, { useEffect } from "react";
 
// export default function PaymentStatusBrick({ paymentId }) {
//   useEffect(() => {
//     const mp = new window.MercadoPago('TEST-d9688230-b4e5-44fc-b5f4-3dcdaa1fbbe2', { // Add your public key credential
//       locale: 'pt'
//     });
//     const bricksBuilder = mp.bricks();
    
//     const renderStatusScreenBrick = async (bricksBuilder) => {
//       const settings = {
//         initialization: {
//           paymentId: paymentId || '1234567890', // Payment identifier, from which the status will be checked
//         },
//         customization: {
//           visual: {
//                 hideStatusDetails: true,
//                 hideTransactionDate: true,
//                 style: {
//                 theme: 'default', // 'default' | 'dark' | 'bootstrap' | 'flat'
//                 },
//             },
//           backUrls: {
//             'error': '<http://<your domain>/error>',
//             'return': '<http://<your domain>/homepage>'
//           }
//         },
//         callbacks: {
//           onReady: () => {
//             // Callback called when Brick is ready
//           },
//           onError: (error) => {
//             // Callback called for all Brick error cases
//           },
//         },
//       };
//       window.statusScreenBrickController = await bricksBuilder.create('statusScreen', 'statusScreenBrick_container', settings);
//     };
    
//     renderStatusScreenBrick(bricksBuilder);
//   }, [paymentId]);
 
//   return (
//     <div>
//       <h2>Status do Pagamento</h2>
//       <div id="statusScreenBrick_container"></div>
//     </div>
//   );
// }