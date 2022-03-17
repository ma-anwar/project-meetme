import { Toolbar, IconButton } from '@mui/material';
import {
  NavigateNext,
  NavigateBefore,
  CheckCircleOutline,
} from '@mui/icons-material';
export default function Step2({ formStep, setFormStep, isValid }) {
  return (
    <Toolbar sx={{ width: '100%', justifyContent: 'space-between' }}>
      <IconButton
        disabled={formStep === 0}
        onClick={() => setFormStep(formStep - 1)}
      >
        <NavigateBefore />
      </IconButton>
      {isValid() ? (
        <IconButton type="submit">
          <CheckCircleOutline />
        </IconButton>
      ) : null}
      <IconButton
        fontSize="large"
        disabled={formStep >= 2}
        onClick={() => setFormStep(formStep + 1)}
      >
        <NavigateNext />
      </IconButton>
    </Toolbar>
  );
}
