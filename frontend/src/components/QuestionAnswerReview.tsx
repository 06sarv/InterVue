import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

interface QA {
  question: string;
  answer: string;
  followUp?: string;
}

interface QuestionAnswerReviewProps {
  items: QA[];
}

const QuestionAnswerReview: React.FC<QuestionAnswerReviewProps> = ({ items }) => (
  <List>
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        <ListItem>
          <ListItemText
            primary={<Typography variant="subtitle1">Q{idx + 1}: {item.question}</Typography>}
            secondary={<Typography variant="body2">A: {item.answer}</Typography>}
          />
        </ListItem>
        {item.followUp && (
          <ListItem>
            <ListItemText
              primary={<Typography variant="body2" color="primary">Follow-up Question</Typography>}
              secondary={item.followUp}
              sx={{ pl: 4 }}
            />
          </ListItem>
        )}
        {idx < items.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </List>
);

export default QuestionAnswerReview;
export {}; 