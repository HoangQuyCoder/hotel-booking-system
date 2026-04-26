<#include "layout/header.ftl">

<p>Hello ${userName}!</p>
<p>Your payment has been successfully refunded.</p>

<p><b>Transaction Code:</b> ${transactionCode}</p>
<p><b>Refund Amount:</b> ${refundAmount!amount!}</p>
<p><b>Refund Date:</b> ${refundDate!paymentDate!}</p>

<p>If you have any questions, please contact our customer support.</p>

<#include "layout/footer.ftl">
