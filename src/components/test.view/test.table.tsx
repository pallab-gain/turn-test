import * as React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { LinearProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import {useState} from 'react';
import TurnTester from '../turn-test/turn.test';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    progressBar: {
        margin: theme.spacing(5, 0, 2),
    },
}));

const TestView = ()=> {
    const classes = useStyles();
    const [progress, setProgress] = useState(0);
    // initially test result is false
    const [testResult, setTestResult] = useState(false);

    const resultCallback = (error: string, success: string): void => {
        setProgress(100);
        setTestResult( error !== 'failed');
    };
    const progressCallback = (progress: number): void => {
        console.warn('current progress', progress);
        setProgress(progress);
    };

    const isRunning = (): boolean => {
        return progress > 0 && progress < 100 ;
    };


    const turnTester = new TurnTester(15000, resultCallback, progressCallback);
    const startTest = ()=> {
        turnTester.startTest();
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Test Turn Server
                </Typography>
                <div className={classes.form}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="address"
                        label="Turn Server URL"
                        name="url"
                        autoComplete="current-url"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="uname"
                        label="Turn User Name"
                        name="uname"
                        autoComplete="current-uname"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Turn User Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isRunning()}
                        onClick={startTest}
                    >
                        Test server
                    </Button>
                    <LinearProgress variant="determinate" value={progress} color={"primary"} className={classes.progressBar}/>
                    {
                        !isRunning() && testResult &&
                        <Alert severity="success">
                          <AlertTitle>Success</AlertTitle>
                          Turn server OK!
                        </Alert>
                    }
                    {
                        !isRunning() && !testResult &&
                        <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Please check your turn server.
                    </Alert>}
                </div>
            </div>
        </Container>
    );
}

export default TestView;
