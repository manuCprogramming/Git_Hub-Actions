const core = require('@actions/core');
const exec = require('@actions/exec');
//validate a branchname is validstring
const validateBranchName= ({branchName}) => /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);

const directoryName= ({workdir}) => /^[a-zA-Z0-9_\-\.\/]+$/.test(workdir);


(async function run()
{
    const  baseBranch= core.getInput('base-branch');
    
    const targetBranch=core.getInput('target-branch');
    const workingDirectory=core.getInput('working-directory');
    const gitToken=core.getInput('gh-token');
    const isDebug=core.getBooleanInput('debug-msg');
    if(gitToken) {
        core.setSecret(gitToken);
    }
    if(!validateBranchName({ branchName: baseBranch} ))
    {
        core.error('Branch name is Invalid...!')
    }
    
    if(!validateBranchName({ branchName: targetBranch } ))
    {

        core.setFailed('Target barnch name is Invalid...!');
        return;
    }
    
    if(!directoryName({workdir: workingDirectory} ))
    {
        core.error('working directory  name is Invalid...!')
    }
    /*
    A. Parse inputs:
    1.base-branch from which to check for update
    2. target-branch to use to create the PR
    3. github token for authentication purpose (to create PR)
    4. working directory for which to check for dependencies

    B.
    
    */
    core.info('I am a Custom JS action');
    core.info(`[js-dependency-update]: base branch is ${baseBranch}`);
    core.info(`[js-dependency-update]: target branch is ${targetBranch}`);
    core.info(`[js-dependency-update]: working directory is ${workingDirectory}`);
    await exec.exec('npm update', [],{
        cwd : workingDirectory
    });
    const gitStatus= await exec.getExecOutput('git status -s package.*json',[],{
        cwd : workingDirectory
    });
    if(gitStatus.stdout.length >0)
    {
        core.info('There are updates avaiable..!');

    }
    else
    {
        core.info('No updates at this point in time');
    }
} )

()