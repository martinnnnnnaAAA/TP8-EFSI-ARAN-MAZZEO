import styles from './Bandera.module.css';
const Bandera = ({ flagSrc, altText }) => {
  return <img className={styles.Bandera} src={flagSrc} alt={altText} />;
};

export default Bandera;
