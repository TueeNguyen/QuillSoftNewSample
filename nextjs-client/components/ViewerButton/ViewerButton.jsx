import FormGroup from '@material-ui/core/FormGroup';

export default function ViewerButton({ labels, onClicks }) {
    return (
        <FormGroup>
            {labels.map((value, index) => {
                <button value={value} onClick={onClicks[index]}/>
            })
            }
        </FormGroup>
    );
}