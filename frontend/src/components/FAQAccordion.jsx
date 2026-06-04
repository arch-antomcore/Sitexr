import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, QuestionCircle, ChatRightText } from "react-bootstrap-icons";

const faqs = [
  {
    question: "COMO FUNCIONA A COMPRA EM GRUPO?",
    answer:
      "A compra em grupo (Group Buy) exige que um número mínimo de colecionadores (geralmente 3) compre o produto para ativar o desconto promocional no AliExpress. Nós ajudamos a juntar as pessoas para fechar o grupo e liberar o preço promocional!",
  },
  {
    question: "O PAGAMENTO É FEITO NA PLATAFORMA?",
    answer:
      "Não! Toda a transação, pagamento e envio são feitos de forma segura diretamente no AliExpress. A nossa plataforma funciona como um mural para compartilhar e encontrar links de grupos ativos da comunidade.",
  },
  {
    question: "QUANTO TEMPO DURA UM LINK DE GRUPO?",
    answer:
      "Geralmente, os links de grupos criados no AliExpress duram apenas 24 horas. Se você ver um grupo ativo para uma figure ou miniatura que deseja, tente entrar o quanto antes para não perder a oferta!",
  },
  {
    question: "COMO POSSO DIVULGAR MEU GRUPO?",
    answer:
      "Basta clicar no botão 'Divulgar Grupo' no cabeçalho, copiar o link de compartilhamento do seu grupo gerado no app do AliExpress e colar no formulário. Nós buscamos o título, preço e imagem automaticamente para criar o post.",
  },
  {
    question: "QUAIS PRODUTOS POSSO COMPARTILHAR?",
    answer:
      "A nossa comunidade é focada exclusivamente em colecionáveis: action figures, estátuas de anime, miniaturas de carros (die-cast), model kits (Gundam, etc.) e coleções afins. Postagens fora desse nicho serão removidas.",
  },
  {
    question: "ENTRAR EM UM GRUPO É SEGURO?",
    answer:
      "Totalmente seguro. Como a compra final é processada e protegida pelas políticas oficiais de reembolso do AliExpress, você tem garantia total sobre a sua compra. Apenas confira a reputação da loja parceira antes de fechar.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-[#0d0e12] border-t-4 border-black px-6 py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="mx-auto max-w-4xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16 flex flex-col items-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 bg-[#ff4d4d]/10 text-[#ff4d4d] border border-[#ff4d4d]/30 px-3 py-1.5 text-[10px] font-display">
            <QuestionCircle size={12} />
            FAQ
          </div>
          <h2 className="mb-4 text-2xl sm:text-3xl font-display tracking-tight text-white uppercase leading-tight">
            Perguntas Frequentes
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-neutral-400 font-body">
            Dúvidas sobre o funcionamento das compras em grupo de colecionáveis? Nós te ajudamos a entender as regras do jogo!
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <div className="pixel-card overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left md:p-6 bg-[#181822] hover:bg-[#1f1f2e] transition-colors group"
                  >
                    <span className="pr-4 text-xs sm:text-sm font-display text-white leading-normal group-hover:text-[#ff4d4d] transition-colors">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0 ml-2"
                    >
                      <ChevronDown size={18} className="text-neutral-400 group-hover:text-[#ff4d4d]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-[#14141c]"
                      >
                        <div className="border-t-2 border-black p-5 md:p-6">
                          <p className="text-sm text-neutral-300 leading-relaxed font-body">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center md:mt-16"
        >
          <div className="pixel-card bg-gradient-to-br from-[#181822] to-[#12121a] p-6 md:p-8 flex flex-col items-center">
            <ChatRightText size={36} className="mb-4 text-[#ff4d4d]" />
            <h3 className="mb-2 text-sm sm:text-base font-display text-white uppercase">
              Ainda tem dúvidas?
            </h3>
            <p className="mb-6 text-sm text-neutral-400 max-w-md font-body">
              Fale com a nossa comunidade de colecionadores no Discord ou consulte o suporte oficial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn text-center"
              >
                Entrar no Discord
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQAccordion;
