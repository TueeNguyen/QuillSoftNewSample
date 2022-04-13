import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = ({
    barColorPrimary: {
        backgroundColor: '#39A626',
    },
    colorPrimary: {
        backgroundColor: '#FFFFFF',
    }
});

/**
 * Class: ProgressBar
 * - displays the 4 steps in the progress bar
 * - gets info from parent component FileUploader
 * - uses styles to determine bar and progress color (shades of green)
 */
class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }

    progressTypes() {
        return (
            <div className="progresstype-style">
                <p>Step 1: Uploading the Document</p>
                <p>Step 2: Processing Document</p>
                <p>Step 3: Generating Clusters</p>
                <p>Step 4: Finalizing</p>
            </div>
        );
    }

    render() {
        const { classes, progress, progressStatus } = this.props;
        return (
           <div className="progress-style">
                <p>We are processing your document...</p>
                <p>{progressStatus}</p>
                <LinearProgress
                    style={{height: "2rem", borderRadius: "1rem", border: "0.25rem solid #B7B7B7"}}
                    variant="determinate"
                    value={progress}
                    classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}
                />
                {this.progressTypes()}
            </div> 
        );
    }
}

export default withStyles(useStyles)(ProgressBar)
