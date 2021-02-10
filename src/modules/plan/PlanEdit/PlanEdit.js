import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useForm, Controller, ErrorMessage } from 'react-hook-form';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import { ActionTypes } from '../../../constants';
import { PlanActions } from '../../../store/actions';
import { requestSuccess, requestFail } from '../../../helpers/request';
import { capitalizeFirstLetter } from '../../../helpers';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const PlanEdit = (props) => {
  const classes = useStyles();
  const {
    getPlan,
    addPlan,
    updatePlan,
    plan,
    status,
    error,
    history,
    match: { params }
  } = props;
  const { control, handleSubmit, setValue, watch, errors } = useForm();

  useEffect(() => {
    if (params.id) getPlan(params.id);
  }, []);

  useEffect(() => {
    if (!plan || !plan.toJS()) return;
    setValue('destination', plan.toJS().destination);
    setValue('startDate', plan.toJS().start_date);
    setValue('endDate', plan.toJS().end_date);
    setValue('comment', plan.toJS().comment);
  }, [plan]);

  const requestIsSucceeded = () => {
    return status === requestSuccess(ActionTypes.ADD_PLAN) || status === requestSuccess(ActionTypes.UPDATE_PLAN);
  };

  const requestIsFailed = () => {
    return status === requestFail(ActionTypes.ADD_PLAN) || status === requestFail(ActionTypes.UPDATE_PLAN);
  };

  const getErrorText = () => {
    if (error.status === 401) return 'Error: 401 (Unauthorized)';
    return error ? Object.keys(error.data).map((key) => (
      <div key={key}>{`${capitalizeFirstLetter(key)}: ${error.data[key]}`}</div>
    )) : '';
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const onSubmit = (data) => {
    if (params.id) updatePlan(plan.toJS().id, data);
    else addPlan(data);
  };

  return (
    <>
      <Container maxWidth="sm">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {params.id ? 'Edit travel plan' : 'Add a new travel plan'}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            {requestIsSucceeded() && (
              <Alert color="success">
                {params.id ? 'Update a plan successfully': 'Create a new plan successfully'}
              </Alert>
            )}
            {requestIsFailed() && (
              <Alert color="error">
                {getErrorText()}
              </Alert>
            )}
            <Grid container spacing={1}>
              <Grid item sm={12}>
                <Controller
                  as={
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Destination"
                      autoComplete="destination"
                      autoFocus
                    />
                  }
                  name="destination"
                  control={control}
                  rules={{
                    required: 'Destination is required',
                  }}
                  defaultValue=""
                />
                <ErrorMessage as={<Typography color="error" />} errors={errors} name="destination" />
              </Grid>
              <Grid item sm={6}>
                <Controller
                  as={
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      type="date"
                      label="Start date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  }
                  name="startDate"
                  control={control}
                  rules={{
                    required: 'Start date is required',
                  }}
                  defaultValue=""
                />
                <ErrorMessage as={<Typography color="error" />} errors={errors} name="starDate" />
              </Grid>
              <Grid item sm={6}>
                <Controller
                  as={
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      type="date"
                      label="End date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  }
                  name="endDate"
                  control={control}
                  rules={{
                    required: 'End date is required',
                    validate: (value) => new Date(value) >= new Date(watch('startDate')) || 'End date should be greater'
                  }}
                  defaultValue=""
                />
                <ErrorMessage as={<Typography color="error" />} errors={errors} name="endDate" />
              </Grid>
              <Grid item sm={12}>
                <Controller
                  as={
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      multiline
                      rows="5"
                      label="Comment"
                    />
                  }
                  name="comment"
                  control={control}
                  defaultValue=""
                />
              </Grid>
              <Grid container>
                <Grid item xs>
                  <Button color="primary" onClick={handleGoBack}>
                    Back
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {params.id ? 'Update': 'Add'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  )
};

const mapStateToProps = (state) => ({
  plan: state.getIn(['plan', 'plan']),
  status: state.getIn(['plan', 'status']),
  error: state.getIn(['plan', 'error']),
});

const mapDispatchToProps = {
  getPlan: PlanActions.getPlan,
  addPlan: PlanActions.addPlan,
  updatePlan: PlanActions.updatePlan,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(PlanEdit);
