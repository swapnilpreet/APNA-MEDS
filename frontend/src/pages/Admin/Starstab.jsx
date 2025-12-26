import React from "react";
import "./css/StatsTabs.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Starstab = () => {
   const statsData = [
     { name: "Week", Users: 20, Orders: 35, Medicines: 5 },
     { name: "Month", Users: 80, Orders: 150, Medicines: 25 },
     { name: "Year", Users: 900, Orders: 1100, Medicines: 300 },
   ];
 
   const labels = statsData.map((item) => item.name);
 
   const data = {
     labels,
     datasets: [
       {
         label: "Users",
         data: statsData.map((item) => item.Users),
         backgroundColor: "#8884d8",
         borderRadius: 6,
       },
       {
         label: "Orders",
         data: statsData.map((item) => item.Orders),
         backgroundColor: "#82ca9d",
         borderRadius: 6,
       },
       {
         label: "Medicines",
         data: statsData.map((item) => item.Medicines),
         backgroundColor: "#ffc658",
         borderRadius: 6,
       },
     ],
   };
 
   const options = {
     responsive: true,
     maintainAspectRatio: false,
     plugins: {
       legend: {
         position: "top",
         labels: {
           font: { size: 14 },
           boxWidth: 20,
         },
       },
       title: {
         display: true,
         text: "User, Order, and Medicine Stats",
         font: { size: 18 },
       },
     },
     scales: {
       x: {
         ticks: {
           font: { size: 12 },
         },
       },
       y: {
         ticks: {
           font: { size: 12 },
         },
       },
     },
   };
 
   return (
     <div className="stats-content">
       <h2>Dashboard</h2>
       <div className="chart-wrapper">
         <Bar data={data} options={options} />
       </div>
     </div>
   );
}

export default Starstab;