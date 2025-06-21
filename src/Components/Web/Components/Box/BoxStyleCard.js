import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

const BoxStyleCard = ({ children, sx, ...props }) => {
  return (
    <Box
      sx={{
        border: '#1a2035 1px solid',
        padding: 3,
        borderRadius: 2,
        backgroundColor: '#1a2035',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
BoxStyleCard.propTypes = {
  children: PropTypes.node,
};

export default BoxStyleCard;

// OK
