import { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactModal from 'react-modal';
import CategoryBox from './CategoryBox';
import Property from './Property';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from '@material-ui/core/Switch';
import styles from './PropertiesModal.module.css';
import { grey } from '@material-ui/core/colors';
import React from 'react';
import { editConfig, getConfig } from '../../services/api-call';

/**
 * Function: PropertiesModal
 * - the styles the modal in the Configurations button on the top right corner 
 */
const PropertiesModal = ({ showModal, handleCloseModal }) => {

  useEffect(() => {
    initConfig();
    ReactModal.setAppElement(document.getElementById('__next'));
  }, []);

  const initConfig = () => {
    getConfig()
      .then(r => {
        const configs = r.data;
        setFormState({
          sentencesByParagraph: configs.SentencesByParagraph,
          preprocessPDF: configs.PreprocessPDF,
          textRankRatio: configs.TextrankRatio,
          summarizationSimilarityThreshold: configs.SummSimilarityThreshold,
          lemma: configs.Lemma,
          phrasesPercentage: configs.PhrasesPercentage,
          topKeyPhrasesCount: configs.TopKeyPhrasesCount,
          extractionSimilarityThreshold: configs.PhraseSimilarityThreshold,
          nGrams: configs.NGrams,
          normalize: configs.Normalize,
        })
      })
  }

  const [formState, setFormState] = useState({
    sentencesByParagraph: 10,
    preprocessPDF: true,
    textRankRatio: 0.2,
    summarizationSimilarityThreshold: 0.3,
    lemma: true,
    phrasesPercentage: 5,
    topKeyPhrasesCount: 100,
    extractionSimilarityThreshold: 0.7,
    nGrams: 1,
    normalize: true,
  });

  const CustomSwitch = withStyles({
    switchBase: {
      '&$checked': {
        color: '#57c244',
        '& + $track': {
          backgroundColor: '#98F488',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#98F488',
      },
    },
    thumb: {
      borderRadius: 0
    },
    track: {
      borderRadius: 0,
      backgroundColor: grey[500]
    },
    checked: {},
    focusVisible: {}
  })(Switch);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const prevState = formState;
    setFormState({
      ...prevState,
      [name]: value,
    });
  };


  const handleSubmit = (event) => {
    // add logic to save form state to global context
    console.log({ ...formState });
    alert('The Configuration criteria has been updated');

    editConfig(
      formState.sentencesByParagraph,
      formState.preprocessPDF,
      formState.textRankRatio,
      formState.summarizationSimilarityThreshold,
      formState.lemma,
      formState.phrasesPercentage,
      formState.topKeyPhrasesCount,
      formState.extractionSimilarityThreshold,
      formState.nGrams,
      formState.normalize
    );
    
    event.preventDefault();
    handleCloseModal();
  };

  const configurations = () => {
    return (
      <React.Fragment>
      <CategoryBox title='General'>
            <Property label='Sentences by Paragraph'>
              <input
                className={styles.input}
                type='number'
                min='1'
                max='100'
                step='1'
                required
                id='sentencesByParagraph'
                name='sentencesByParagraph'
                value={formState.sentencesByParagraph}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              ></input>
            </Property>
            <Property label='Preprocess PDF'>
              <FormGroup>
                <FormControlLabel control={
                  <CustomSwitch
                  checked={formState.preprocessPDF}
                  onChange={(e) => {
                    handleInputChange(e);
                }}
                name='preprocessPDF'
              />} label={formState.preprocessPDF == true ? 'ON' : 'OFF'} labelPlacement='start' />
              </FormGroup>
            </Property>
          </CategoryBox>
          <CategoryBox title='Text Summarization'>
            <Property label='Text Rank Ratio'>
              <input
                className={styles.input}
                type='number'
                min='0.1'
                max='1'
                step='0.1'
                required
                id='textRankRatio'
                name='textRankRatio'
                value={formState.textRankRatio}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              ></input>
            </Property>
            <Property label='Similarity Threshold'>
              <input
                className={styles.input}
                type='number'
                min='0.1'
                max='1'
                step='0.1'
                required
                id='summarizationSimilarityThreshold'
                name='summarizationSimilarityThreshold'
                value={formState.summarizationSimilarityThreshold}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              ></input>
            </Property>
            <Property label='Lemma'>
              <FormGroup>
                <FormControlLabel control={<CustomSwitch
                checked={formState.lemma}
                  onChange={(e) => {
                    handleInputChange(e);
                }}
                name='lemma'
              />} label={formState.lemma == true ? 'ON' : 'OFF'} labelPlacement='start'/>
              </FormGroup>
            </Property>
          </CategoryBox>
          <CategoryBox title='Phrase Extraction'>
            <Property label='Phrases Percentage'>
              <input
                className={styles.input}
                type='number'
                min='0'
                max='100'
                step='1'
                required
                id='phrasesPercentage'
                name='phrasesPercentage'
                value={formState.phrasesPercentage}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              ></input>
            </Property>
            <Property label='Top Key Phrases Count'>
              <input
                className={styles.input}
                type='number'
                min='1'
                max='1000'
                step='1'
                required
                id='topKeyPhrasesCount'
                name='topKeyPhrasesCount'
                value={formState.topKeyPhrasesCount}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              ></input>
            </Property>
            <Property label='Similarity Threshold'>
              <input
                className={styles.input}
                type='number'
                min='0.1'
                max='1'
                step='0.1'
                required
                id='extractionSimilarityThreshold'
                name='extractionSimilarityThreshold'
                value={formState.extractionSimilarityThreshold}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              ></input>
            </Property>
            <Property label='NGrams'>
              <input
                className={styles.input}
                type='number'
                min='1'
                max='6'
                step='1'
                required
                id='nGrams'
                name='nGrams'
                value={formState.nGrams}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              ></input>
            </Property>
            <Property label='Normalize'>
              <FormGroup>
                <FormControlLabel control={<CustomSwitch
                  checked={formState.normalize}
                  style={{pointerEvents: "auto"}}
                  onChange={(e) => {
                    handleInputChange(e);
                }}
                name='normalize'
              />} label={formState.normalize == true ? 'ON' : 'OFF'} labelPlacement='start'/>
              </FormGroup>
            </Property>
        </CategoryBox>
      </React.Fragment>
    );
  }

  return (
    <ReactModal
      style={{ overflowY: "scroll" }}
      isOpen={showModal}
      contentLabel='Configuration Properties Modal'
      onRequestClose={handleCloseModal}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnOverlayClick={false}
    >
      <h1 className={styles.heading}>
        Configuration Properties
      </h1>
      
      <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.body}>
          {configurations()}
        </div>
        <input className={styles.saveButton} type='submit' value='Save' />
      </form>
    </ReactModal>
  );
};

export default PropertiesModal;
