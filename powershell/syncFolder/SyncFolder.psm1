Function updateLastWriteTime ($file, $time) {
    if (!$file) {
        throw "The required 'file' parameter is missing for the call to updateLastWriteTime."
    }

    if (!$time) {
        throw "The required 'time' parameter is missing for the call to updateLastWriteTime."
    }

    # update file last modified time
    $destItem = Get-Item $file

    if ($destItem) {
        $destItem.LastWriteTime = $time
        Write-Verbose ("  The LastWriteTime has been set to $time for destination file $file")
    }
    else {
        throw "The destination item $file was not found.  The last modified time could not be changed.  This is unexpected."
    }
}

Function processDir($srcPath, $destPath) {
    # make sure source directory exists and is a directory
    if (!(Test-Path "$srcPath" -pathType container)) {
        throw "The source directory $srcPath does not exist or is not a directory."
    }
        
    # make sure destination directory exists and is a directory
    if (!(Test-Path "$destPath" -pathType container)) {
        throw "The destination directory $destPath does not exist or is not a directory."
    }
    
    # get all the child items for current src directory
    $items = Get-ChildItem -Path $srcPath

    Write-Verbose ("** Src directory:  $srcPath")
    
    foreach ($item in $items) {
        Write-Verbose ("  ++ processing src child item:  $($item.Name)")
        
        if (([string]$item.Attributes).Contains("Directory")) {
            $newDestPath = ($destPath + "\" + $item.Name)
            
            if (!(Test-Path -Path $newDestPath)) {
                Write-Verbose ("  ** Creating Dest directory:  $newDestPath")
                New-Item -ItemType directory -Path $newDestPath > $null
            }

            processDir $item.FullName $newDestPath
        }
        else {
            $destFile = ($destPath + "\" + $item.Name)
            
            if (!(Test-Path $destFile -PathType Leaf)) {
                Write-Verbose ("  >> Copying file  $($item.FullName)  to  $destFile")
                Copy-Item $item.FullName $destFile > $null

                # save the src last modified time so it can be applied to the dest; otherwise, 
                # the dest will have a newer time which would cause the cmdlet to copy it back
                # even if no changes occurred to the file
                updateLastWriteTime $destFile $item.LastWriteTime
            }
            else {
                $destFileObj = (Get-Item $destFile)
                
                if (!$destFileObj) {
                    throw "Unable to convert $destFile to object"
                }
                
                if ($item.LastWriteTime -gt $destFileObj.LastWriteTime) {
                    Write-Verbose ("  >> Src is newer than Dest - copying file  $($item.FullName)  to  $destFile")
                    Copy-Item $item.FullName $destFile > $null
                    updateLastWriteTime $destFile $item.LastWriteTime
                }
                elseif ($item.LastWriteTime -lt $destFileObj.LastWriteTime){
                    Write-Verbose ("     Src file is older than Dest file...no copy required")
                }
                else {
                    Write-Verbose ("     Src and Dest files match...no copy required")
                }
            }
        }
    }
}


<#
.Synopsis
   Copy file and directory changes from source folder to destination folder.

.DESCRIPTION
   The source directory will be scanned and any files not found in the destination folder will be written to the destination folder.
   Any files found in the source that are newer than files in the destination will be written to the destination.  Warning - destination
   files will be over-written.

   If the destination folder is empty, an exact copy of source will be written to the destination.  If the destination folder is not empty, files and 
   folders that only exist in destination will not be affected, i.e. they will not be removed because they do not exist in the source.
   
   Both the source and destination directories must exist.  If either folder is missing, the script will end with an exception.

   The confirm level has been set to "high" so that the user is always prompted to continue.

.EXAMPLE
   Sync-Folder -src "c:\server\myfiles" -dest "f:\workFromHome\myfiles"

   This example would copy work files to a device that could be taken home and used on another computer.

.EXAMPLE
   Sync-Folder -src "f:\workFromHome\myfiles" -dest "f:\server\myfiles"

   This example would copy files that were created or modified while working from home.

.EXAMPLE
   sf -src "c:\srcFolder" -dest "c:\destFolder"

   Using alias to run command.

.EXAMPLE
   sf -src "c:\srcFolder" -dest "c:\destFolder" -WhatIf

   The WhatIf flag will show what the command "would" do.  This is an information message.  No work will be done.

.EXAMPLE
   Sync-Folder -src "c:\srcFolder" -dest "c:\destFolder" -Verbose

   The Verbose flag will print messages to the screen as work is done.

.EXAMPLE
   Sync-Folder -src "c:\srcFolder" -dest "c:\emptyFolder" -Verbose

   If the emptyFolder is empty, i.e. contains no directories or files, this example will completely backup
   the srcFolder to the emptyFolder.

.INPUTS
   src - name of input root folder from which scan should begin
   dest - name of output root folder where source files will be written
   
.NOTES
   This CmdLet supports the command line flags -Verbose and -WhatIf.  The alias "sf" may be used instead of "Sync-Folder".
#>
Function Sync-Folder {
    [CmdletBinding(SupportsShouldProcess=$true, ConfirmImpact="High")]
    [Alias("sf")]
    Param
    ([Parameter(Mandatory=$true)][string] $src,
     [Parameter(Mandatory=$true)][string] $dest)
    
    try {
        # make sure source directory exists and is a directory
        if (!(Test-Path "$src" -pathType container)) {
            throw "The source directory $src does not exist or is not a directory."
        }
        
        # make sure destination directory exists and is a directory
        if (!(Test-Path "$dest" -pathType container)) {
            throw "The destination directory $dest does not exist or is not a directory."
        }

        if ($pscmdlet.ShouldProcess("Newer files and directories from $src will be applied to $dest.  Waring - files in $dest may be over-written.")) {
            processDir $src $dest
        }
    }
    catch {
        Write-Error $_ -ErrorAction Stop
    }
}
