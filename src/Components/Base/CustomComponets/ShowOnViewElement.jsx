import { useInView } from 'react-intersection-observer';
import { motion } from 'motion/react';

export const ShowOnViewElement = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};
