import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "../css/FAQ.css";

const faqs = [
  {
    question: "What is Apna-Meds?",
    answer:
      "Apna-Meds is an online platform to buy medicines and healthcare products with doorstep delivery.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive an email and SMS with tracking details.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use industry-standard encryption to protect your data.",
  },
  {
    question: "Can I return my medicines?",
    answer:
      "Returns are accepted within 7 days for eligible products. Check our return policy for details.",
  },
   {
    question: "What is Apna-Meds?",
    answer:
      "Apna-Meds is an online platform to buy medicines and healthcare products with doorstep delivery.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive an email and SMS with tracking details.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use industry-standard encryption to protect your data.",
  },
  {
    question: "Can I return my medicines?",
    answer:
      "Returns are accepted within 7 days for eligible products. Check our return policy for details.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className="faq-icon">
                {activeIndex === index ? <FaMinus /> : <FaPlus />}
              </span>
            </div>
            <div className={`faq-answer ${activeIndex === index ? "open" : ""}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
